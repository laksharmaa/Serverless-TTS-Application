const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',  // Can restrict to specific domains if needed
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


AWS.config.update({ region: 'ap-south-1' });
const polly = new AWS.Polly();
const JWT_SECRET = process.env.JWT_SECRET;

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

app.post('/api/speech', authenticateToken, async (req, res) => {
  const { text, voiceId } = req.body;
  if (!text || !voiceId) return res.status(400).json({ error: 'Text and VoiceId are required' });

  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceId,
  };
  try {
    const result = await polly.synthesizeSpeech(params).promise();
    const audioBase64 = result.AudioStream.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
    res.json({ audioUrl });
  } catch (error) {
    res.status(500).json({ error: 'Could not synthesize speech' });
  }
});

module.exports.handler = serverless(app);
