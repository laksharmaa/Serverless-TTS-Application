const express = require('express');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',  // Can restrict to specific domains if needed
  methods: ['GET', 'POST', 'DELETE'],
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

app.post('/api/save-blog', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { blogContent } = req.body;
  const blogId = uuidv4();
  const params = {
    TableName: 'SavedBlogs',
    Item: { blogId, username, blogContent, createdAt: new Date().toISOString() },
  };
  try {
    await dynamoDb.put(params).promise();
    res.json({ message: 'Blog saved successfully', blogId });
  } catch (error) {
    res.status(500).json({ error: 'Could not save blog' });
  }
});


app.get('/api/get-blogs', authenticateToken, async (req, res) => {
  console.log('Authenticated user:', req.user); // Log the authenticated user
  const username = req.user.username;

  // Ensure the username is present
  if (!username) {
    return res.status(400).json({ error: 'Username is missing' });
  }

  const params = {
    TableName: 'SavedBlogs',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: { ':username': username },
  };

  console.log('Querying with params:', params); // Debugging: log the parameters

  try {
    const result = await dynamoDb.query(params).promise();
    console.log('DynamoDB query result:', result);  // Debugging: log the result
    res.json(result.Items);
  } catch (error) {
    console.error('Error querying DynamoDB:', error); // Log the error
    res.status(500).json({ error: 'Could not retrieve blogs' });
  }
});


app.get('/api/get-blog/:blogId', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { blogId } = req.params;
  const params = {
    TableName: 'SavedBlogs',
    Key: { username, blogId },
  };
  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) return res.status(404).json({ error: 'Blog not found' });
    res.json(result.Item);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve blog' });
  }
});

app.delete('/api/delete-blog', authenticateToken, async (req, res) => {
  const { blogId } = req.body;
  const username = req.user.username;
  const params = {
    TableName: 'SavedBlogs',
    Key: { username, blogId },
  };
  try {
    await dynamoDb.delete(params).promise();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete blog' });
  }
});


app.get('/api/public-blogs', async (req, res) => {
  const params = {
    TableName: 'Blogs',
    IndexName: 'isPublic-index', // Assuming you've created a secondary index on 'isPublic'
    KeyConditionExpression: 'isPublic = :isPublic',
    ExpressionAttributeValues: {
      ':isPublic': 'true', // Use 'true' as string instead of boolean true
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    res.json(result.Items);
  } catch (error) {
    console.error('Error retrieving public blogs:', error);
    res.status(500).json({ error: 'Could not retrieve public blogs' });
  }
});

app.get('/api/public-blog/:blogId', async (req, res) => {
  const { blogId } = req.params;

  const params = {
    TableName: 'Blogs',
    IndexName: 'blogId-index', // Use the GSI
    KeyConditionExpression: 'blogId = :blogId', // Query on the blogId partition key
    ExpressionAttributeValues: {
      ':blogId': blogId
    },
    ProjectionExpression: 'blogId, username, blogTitle, blogContent, isPublic, createdAt' // Only retrieve necessary fields
  };

  try {
    const result = await dynamoDb.query(params).promise();

    // Check if the blog exists and is public
    if (result.Items.length === 0 || result.Items[0].isPublic !== 'true') {
      return res.status(404).json({ error: 'Public blog not found' });
    }

    res.json(result.Items[0]); // Return the first matching item
  } catch (error) {
    console.error('Error retrieving public blog:', error);
    res.status(500).json({ error: 'Could not retrieve public blog' });
  }
});


module.exports.handler = serverless(app);
