const express = require('express');
const serverless = require('serverless-http');
const { registerUser, loginUser } = require('./authController');
const { synthesizeSpeech } = require('./speechController');
const authenticateToken = require('./authenticateToken'); // Updated path

const app = express();
app.use(express.json());

// User Registration Endpoint
app.post('/register', registerUser);

// User Login Endpoint
app.post('/login', loginUser);

// Text-to-Speech Endpoint (Requires Authentication)
app.post('/api/speech', authenticateToken, synthesizeSpeech);

// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);
