const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SAVED_BLOGS_TABLE = 'SavedBlogs';

const getBlogs = async (req, res) => {
    const username = req.user?.username; // Get username from req.user

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const params = {
        TableName: SAVED_BLOGS_TABLE,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        },
    };

    try {
        const result = await dynamoDb.query(params).promise();
        res.json(result.Items || []); // Ensure an array is returned
    } catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).json({ error: 'Could not retrieve blogs' });
    }
};

module.exports = { getBlogs };
