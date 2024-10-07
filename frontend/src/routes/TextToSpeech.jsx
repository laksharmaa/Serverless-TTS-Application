import React, { useState } from 'react';

function TextToSpeech({ blogId = null }) { // Accept blogId as a prop (optional)
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceId, setVoiceId] = useState('Joanna'); // Default voice
  const [wordCount, setWordCount] = useState(0); // Word count state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [notification, setNotification] = useState(''); // Notification card message
  const [notificationType, setNotificationType] = useState(''); // Type of notification (success or error)
  const [message, setMessage] = useState(''); // UI Message

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.split(/\s+/).filter((word) => word.length > 0).length);
  };

  // Function to show notification
  const showNotification = (message, type = 'error') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(''), 5000); // Hide notification after 5 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setNotification(''); // Reset notification before starting a new request
    setAudioUrl(null);   // Reset audioUrl
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('You must be logged in to convert text to speech.', 'error');
      setIsLoading(false);
      return;
    }

    if (!text.trim()) {
      showNotification('Please provide non-empty text to convert.', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, voiceId, blogId }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        setAudioUrl(audioUrl);
        showNotification('Text successfully converted to speech!', 'success');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'An error occurred while converting text to speech.');
      }
    } catch (error) {
      setMessage('An error occurred while converting text to speech.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveBlog = async () => {
    setMessage('');
    const token = localStorage.getItem('token');

    if (!token) {
      showNotification('You must be logged in to save the blog.', 'error');
      return;
    }

    if (!text.trim()) {
      showNotification('Blog content cannot be empty.', 'error');
      return;
    }

    try {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/save-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogContent: text }),
      });

      if (response.ok) {
        showNotification('Blog saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'An error occurred while saving the blog');
      }
    } catch (error) {
      setMessage('An error occurred while saving the blog.');
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-xl text-gray-900 dark:text-white text-center m-2">Narrate your blog</h1>

      {/* Notification card */}
      {notification && (
        <div
          className={`p-2 rounded-lg mb-4 transition-all ${notificationType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
        >
          {notification}
        </div>
      )}

      {/* Message for success or errors */}
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto flex flex-col space-y-6">
        <textarea
          id="text"
          value={text}
          onChange={handleTextChange}
          className="w-full h-[70vh] p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
          placeholder="Paste the text of any blog post..."
        />

        <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <select
            id="voiceId"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
          >
            <option value="Joanna">Joanna (Female)</option>
            <option value="Matthew">Matthew (Male)</option>
            <option value="Salli">Salli (Female)</option>
            <option value="Ivy">Ivy (Female, Child)</option>
            <option value="Kendra">Kendra (English-US)</option>
          </select>

          {audioUrl && (
            <div className=" w-full md:w-auto flex-grow">
              <audio controls src={audioUrl} className="w-full rounded-lg shadow-sm" />
            </div>
          )}

          <div className="w-full md:w-auto flex justify-between md:justify-start space-x-2">
            <button
              type="submit"
              className="w-full md:w-auto font-inter font-medium bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isLoading ? 'Converting...' : 'Convert'}
            </button>
            <button
              type="button"
              onClick={handleSaveBlog}
              className="w-full md:w-auto font-inter font-medium bg-pink-600 text-white px-4 py-2 rounded-md"
            >
              Save Blog
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}

export default TextToSpeech;
