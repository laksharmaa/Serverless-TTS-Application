const express = require('express');
const serverless = require('serverless-http');
const { registerUser, loginUser } = require('./authController');
const { synthesizeSpeech } = require('./speechController');
const { saveBlog } = require('./saveBlog'); 
const { getBlogs } = require('./getBlogs'); 
const { deleteBlog } = require('./deleteBlog');
const authenticateToken = require('./authenticateToken');

const app = express();
app.use(express.json());

// User Registration Endpoint
app.post('/register', registerUser);

// User Login Endpoint 
app.post('/login', loginUser);

// Text-to-Speech Endpoint (Requires Authentication)
app.post('/api/speech', authenticateToken, synthesizeSpeech);

// Save Blog Endpoint (Requires Authentication)
app.post('/api/save-blog', authenticateToken, saveBlog);

// Get Blogs Endpoint (Requires Authentication)
app.get('/api/get-blogs', authenticateToken, getBlogs);

// Delete Blog Endpoint (Requires Authentication)
app.delete('/api/delete-blog', authenticateToken, deleteBlog);


// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);
