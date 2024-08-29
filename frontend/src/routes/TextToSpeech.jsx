import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceId, setVoiceId] = useState('Joanna'); // Default voice
  const [wordCount, setWordCount] = useState(0); // Word count state

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.split(/\s+/).filter((word) => word.length > 0).length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    if (!token) {
      alert('You must be logged in to use this feature.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, voiceId }), // Include voiceId in the request body
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        setAudioUrl(audioUrl);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred while converting text to speech.');
      }
    } catch (error) {
      alert('An error occurred while converting text to speech.');
    }
  };

  const handleSaveBlog = async () => {
    const token = localStorage.getItem('token');

    if (!token || !text) {
      alert('You need to be logged in and provide text content to save the blog.');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const username = decodedToken.username;
    const blogContent = text;

    try {
      const response = await fetch('/dev/api/save-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, blogContent }),
      });

      if (response.ok) {
        alert('Blog saved successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred while saving the blog');
      }
    } catch (error) {
      alert('An error occurred while saving the blog....');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Convert a Blog into Podcast</h1>
      <form onSubmit={handleSubmit} className="w-full h-full flex flex-col space-y-6">
        <textarea
          id="text"
          value={text}
          onChange={handleTextChange}
          className="w-full h-[70vh] p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
          placeholder="Paste the text of any blog post..."
          required
        />
       
        <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <select
            id="voiceId"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          >

            <option value="Joanna">Joanna (Female)</option>
            <option value="Matthew">Matthew (Male)</option>
            <option value="Salli">Salli (Female)</option>
            <option value="Ivy">Ivy (Female, Child)</option>
            {/* Add more options as needed */}
          </select>
         <label className="text-left text-gray-600 dark:text-gray-400">
         {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </label>
          
          <div className="w-full md:w-auto flex justify-between md:justify-start space-x-2">
            
            <button
              type="submit"
              className="w-full md:w-auto font-inter font-medium bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Convert
            </button>
            <button
              onClick={handleSaveBlog}
              className="w-full md:w-auto font-inter font-medium bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save Blog
            </button>
          </div>
        </div>
      </form>
      {audioUrl && (
        <div className="mt-8 text-center w-full">
          <audio controls src={audioUrl} className="w-full rounded-lg shadow-sm" />
        </div>
      )}
    </div>
  );
}

export default TextToSpeech;
