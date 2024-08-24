const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SAVED_BLOGS_TABLE = 'SavedBlogs';

const deleteBlog = async (req, res) => {
    const { username, blogId } = req.body;

    if (!username || !blogId) {
        return res.status(400).json({ error: 'Username and blogId are required' });
    }

    const params = {
        TableName: SAVED_BLOGS_TABLE,
        Key: {
            username: username,
            blogId: blogId,
        },
    };

    console.log('Deleting blog with params:', params);  // Debugging: log the parameters

    try {
        await dynamoDb.delete(params).promise();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Could not delete blog' });
    }
};

module.exports = { deleteBlog };
