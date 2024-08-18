const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234'; // Use a more secure secret in production

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

module.exports = authenticateToken;
