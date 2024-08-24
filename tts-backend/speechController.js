const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' }); // Replace with your region

// Text-to-Speech Synthesis
const synthesizeSpeech = async (req, res) => {
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
};

module.exports = {
    synthesizeSpeech
};