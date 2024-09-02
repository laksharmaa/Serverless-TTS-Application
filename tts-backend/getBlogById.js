const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const SAVED_BLOGS_TABLE = 'SavedBlogs';

const getBlogById = async (req, res) => {
    const { blogId } = req.params;
    const username = req.user?.username;

    if (!blogId || !username) {
        return res.status(400).json({ error: 'Blog ID and username are required' });
    }

    const params = {
        TableName: SAVED_BLOGS_TABLE,
        Key: { username, blogId },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        if (!result.Item) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(result.Item);
    } catch (error) {
        console.error('Error retrieving blog:', error);
        res.status(500).json({ error: 'Could not retrieve blog' });
    }
};

module.exports = { getBlogById };
