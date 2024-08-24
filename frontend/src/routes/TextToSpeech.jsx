import React, { useState } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    if (!token) {
      alert('You must be logged in to use this feature.');
      return;
    }

    try {
      const response = await fetch('/dev/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
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
  
    // Decode JWT token to get the username
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload of the JWT
    const username = decodedToken.username; // Assuming the username is stored in the token
    
    const blogContent = text; // The text entered in the textarea
  
    console.log({
      username,
      blogContent, // What you intend to save
    });
  
    try {
      const response = await fetch('/dev/api/save-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, blogContent }),
      });
      console.log(response);
  
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Text to Speech</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Enter Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              rows="4"
              placeholder="Enter text to convert to speech..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 focus:ring-4 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            Convert to Speech
          </button>
        </form>
        {audioUrl && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Speech:</h2>
            <audio controls src={audioUrl} className="w-full rounded-lg shadow-sm" />
            <button
              onClick={handleSaveBlog}
              className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-green-700 dark:hover:bg-green-600 transition duration-200 focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400"
            >
              Save Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextToSpeech;
