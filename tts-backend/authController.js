const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

AWS.config.update({ region: 'ap-south-1' }); // Replace with your region

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users'; // Make sure this matches your DynamoDB table name
const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234'; // Use a more secure secret in production

// User Registration
const registerUser = async (req, res) => {
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
            createdAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDb.put(params).promise();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Could not register user' });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const params = {
        TableName: USERS_TABLE,
        Key: {
            username,
        },
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
};

module.exports = { registerUser, loginUser };
