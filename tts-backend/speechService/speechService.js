const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const cors = require('cors');
const crypto = require('crypto'); // For hashing text and voiceId
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

AWS.config.update({ region: 'ap-south-1' });
const polly = new AWS.Polly();
const s3 = new AWS.S3();
const JWT_SECRET = process.env.JWT_SECRET || 'abcde-12345';

app.use(express.json());

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// Function to generate a signed S3 URL for downloading
const generateSignedUrl = (key) => {
  const params = {
    Bucket: 'polly-audiofiles-bucket',
    Key: key,
    Expires: 60 * 60, // 1 hour
  };
  return s3.getSignedUrl('getObject', params);
};

// Function to check if a file already exists in S3 using GetObjectAttributes
const fileExistsInS3 = async (key) => {
  const params = {
    Bucket: 'polly-audiofiles-bucket',
    Key: key,
    ObjectAttributes: ['ETag', 'ObjectSize'], // Use valid attributes
  };
  try {
    console.log(`Checking if file exists: ${key}`);
    const result = await s3.getObjectAttributes(params).promise();
    console.log(`File found with attributes: ${JSON.stringify(result)}`);
    return true; // File exists
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`File not found: ${key}`);
      return false; // File does not exist
    }
    console.error(`Error checking S3 file existence: ${error}`);
    throw error; // Other errors
  }
};

// Function to upload audio to S3
const uploadToS3 = async (key, audioStream) => {
  const params = {
    Bucket: 'polly-audiofiles-bucket',
    Key: key,
    Body: audioStream,
    ContentType: 'audio/mpeg',
  };
  return await s3.putObject(params).promise();
};

app.post('/api/speech', authenticateToken, async (req, res) => {
  const { text, voiceId } = req.body;

  // Generate a consistent blogId using a hash of text and voiceId
  const blogId = crypto.createHash('sha256').update(`${text}-${voiceId}`).digest('hex');

  console.log('Received request with text:', text, 'voiceId:', voiceId, 'Generated blogId:', blogId);

  if (!text || !voiceId) {
    console.error('Missing required parameters:', { text, voiceId });
    return res.status(400).json({ error: 'Text and VoiceId are required' });
  }

  const s3Key = `audiofiles/${blogId}-${voiceId}.mp3`; // Define a key based on blogId and voiceId for caching

  try {
    // Check if the file already exists in S3
    const fileExists = await fileExistsInS3(s3Key);
    if (fileExists) {
      console.log(`File already exists in S3: ${s3Key}`);
      const signedUrl = generateSignedUrl(s3Key);
      return res.json({ audioUrl: signedUrl });
    }

    // If not found, generate the speech with Polly
    console.log('Generating new audio with Polly...');
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId,
    };
    const result = await polly.synthesizeSpeech(params).promise();

    // Upload the audio file to S3
    console.log('Uploading audio to S3...');
    await uploadToS3(s3Key, result.AudioStream);

    // Generate signed URL and return it
    const signedUrl = generateSignedUrl(s3Key);
    console.log(`Audio uploaded and available at: ${signedUrl}`);
    res.json({ audioUrl: signedUrl });

  } catch (error) {
    console.error('Error handling speech request:', error);
    res.status(500).json({ error: 'Could not synthesize speech or save audio' });
  }
});

module.exports.handler = serverless(app);
