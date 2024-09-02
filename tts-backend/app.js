const express = require('express');
const serverless = require('serverless-http');
const { registerUser, loginUser } = require('./authController');
const { synthesizeSpeech } = require('./speechController');
const { saveBlog } = require('./saveBlog'); 
const { getBlogs } = require('./getBlogs'); 
const { deleteBlog } = require('./deleteBlog');
const authenticateToken = require('./authenticateToken');
const { getBlogById } = require('./getBlogById');
const cors = require('cors');

const app = express();
app.use(express.json());

// CORS Middleware
app.use(cors({
    origin: '*', // Allow all origins; adjust as necessary for security
    methods: ['GET', 'POST', 'DELETE'], // Adjust methods according to your needs
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the headers your API supports
}));

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

// Get Blog by ID Endpoint (Requires Authentication)
app.get('/api/get-blog/:blogId', authenticateToken, getBlogById);

// Delete Blog Endpoint (Requires Authentication)
app.delete('/api/delete-blog', authenticateToken, deleteBlog);


// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);
