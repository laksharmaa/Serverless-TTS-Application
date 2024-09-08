const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',  // Can restrict to specific domains if needed
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const JWT_SECRET = process.env.JWT_SECRET;
const dynamoDb = new DynamoDB.DocumentClient();

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const params = {
    TableName: 'Users',
    Item: { username, password: hashedPassword },
  };
  try {
    await dynamoDb.put(params).promise();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);  // Add error logging
    res.status(500).json({ error: 'Could not register user' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const params = {
    TableName: 'Users',
    Key: { username },
  };
  try {
    const user = await dynamoDb.get(params).promise();
    if (!user.Item || !(await bcrypt.compare(password, user.Item.password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ username: user.Item.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Could not log in user' });
  }
});

module.exports.handler = serverless(app);
