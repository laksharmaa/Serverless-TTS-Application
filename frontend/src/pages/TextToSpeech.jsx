import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    setLoading(true);

    try {
      const response = await fetch('/dev/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        const audio = new Audio(audioUrl);
        audio.play().catch(error => console.error('Error playing audio:', error));
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('An error occurred while converting text to speech.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Text-to-Speech</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Converting...' : 'Convert to Speech'}
        </button>
      </form>
    </div>
  );
}

export default TextToSpeech;
