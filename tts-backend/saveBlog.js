const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'ap-south-1' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SAVED_BLOGS_TABLE = 'SavedBlogs';

const saveBlog = async (req, res) => {
    const username = req.user?.username; // Get username from req.user

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const { blogContent } = req.body;

    if (!blogContent) {
        return res.status(400).json({ error: 'Blog content is required' });
    }

    const blogID = uuidv4();

    const params = {
        TableName: SAVED_BLOGS_TABLE,
        Item: {
            blogId: blogID,
            username: username,
            blogContent: blogContent,
            createdAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDb.put(params).promise();
        res.json({ message: 'Blog saved successfully', blogId: blogID });
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ error: 'Could not save blog' });
    }
};

module.exports = { saveBlog };
