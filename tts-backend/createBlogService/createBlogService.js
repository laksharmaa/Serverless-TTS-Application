const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

AWS.config.update({ region: 'ap-south-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
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

app.post('/api/create-blog', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { blogTitle, blogContent, isPublic } = req.body;

  console.log('Incoming request:', { username, blogTitle, blogContent, isPublic });

  if (!blogTitle || !blogContent) {
    console.log('Validation error: Missing blogTitle or blogContent');
    return res.status(400).json({ error: 'Blog title and content are required.' });
  }

  const blogId = uuidv4();
  const params = {
    TableName: 'Blogs',
    Item: {
      blogId,
      username,
      blogTitle,
      blogContent,
      isPublic: isPublic ? 'true' : 'false',  // Store as string 'true' or 'false'
      createdAt: new Date().toISOString(),
    },
  };

  console.log('DynamoDB Put Params:', params);

  try {
    await dynamoDb.put(params).promise();
    console.log('Blog successfully created:', blogId);
    res.json({ message: 'Blog created successfully', blogId });
  } catch (error) {
    console.error('DynamoDB Error:', error);
    res.status(500).json({ error: 'Could not create blog' });
  }
});

module.exports.handler = serverless(app);