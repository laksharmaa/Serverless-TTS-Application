const express = require('express');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');

// Configure AWS SDK
AWS.config.update({ region: 'ap-south-1' }); // Replace with your region

const app = express();
app.use(express.json());

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users'; // Make sure this matches your DynamoDB table name
const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234'; // Use a more secure secret in production

// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
        TableName: USERS_TABLE,
        Item: {
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        }
    };

    try {
        await dynamoDb.put(params).promise();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Could not register user' });
    }
});

// User Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const params = {
        TableName: USERS_TABLE,
        Key: {
            username
        }
    };

    try {
        const result = await dynamoDb.get(params).promise();
        const user = result.Item;

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ username, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Could not log in user' });
    }
});

// Middleware to Authenticate Token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
}

// Text-to-Speech Endpoint (Requires Authentication)
app.post('/api/speech', authenticateToken, async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const polly = new AWS.Polly();
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Joanna' // Choose a voice you prefer
    };

    try {
        const result = await polly.synthesizeSpeech(params).promise();

        // Convert AudioStream to a base64 URL
        const audioBase64 = result.AudioStream.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        console.log(`Audio URL: ${audioUrl}`); // Log the URL in the console for debugging
        res.json({ audioUrl });
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        res.status(500).json({ error: 'Could not synthesize speech' });
    }
});

// Start the server (for local testing)
// if (process.env.NODE_ENV !== 'lambda') {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//         console.log(`SERVER STARTED- http://localhost:${PORT}`);
//     });
// }

// Export the app wrapped in serverless-http
module.exports.handler = serverless(app);
