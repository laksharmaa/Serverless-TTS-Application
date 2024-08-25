
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' }); // Replace with your region

const synthesizeSpeech = async (req, res) => {
    const { text, voiceId } = req.body; // Get voiceId from the request body

    if (!text || !voiceId) {
        return res.status(400).json({ error: 'Text and VoiceId are required' });
    }

    const polly = new AWS.Polly();
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceId // Use the provided voiceId
    };

    try {
        const result = await polly.synthesizeSpeech(params).promise();

        const audioBase64 = result.AudioStream.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        console.log(`Audio URL: ${audioUrl}`); // Log the URL in the console for debugging
        res.json({ audioUrl });
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        res.status(500).json({ error: 'Could not synthesize speech' });
    }
};

module.exports = {
    synthesizeSpeech
};
