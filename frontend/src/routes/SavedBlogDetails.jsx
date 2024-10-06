import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SavedBlogDetails() {
  const { state } = useLocation();
  const blog = state?.blog;
  const [selectedVoice, setSelectedVoice] = useState('Joanna');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (blog) setLoading(false);
  }, [blog]);

  const handleListen = async () => {
    if (!blog) return;

    setIsConverting(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to listen to the blog.');
        setIsConverting(false);
        return;
      }

      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/speech`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: blog.blogContent,
          voiceId: selectedVoice,
          blogId: blog.blogId,  // Passing the blog ID to check if audio already exists
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAudioUrl(data.audioUrl);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'An error occurred while generating speech.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while generating speech.');
    } finally {
      setIsConverting(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!blog) {
    return <p className="text-gray-900 dark:text-white">Blog not found.</p>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <span className="flex bottom-2 right-2 text-gray-600 dark:text-gray-300 text-xs">
        Saved at: {new Date(blog.createdAt).toLocaleString()}
      </span>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {blog.blogContent.split(' ').slice(0, 1).join(' ')}...
      </h2>

      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">{blog.blogContent}</p>

      <div className="flex justify-center items-center space-x-4 mb-4">
        <label className="text-gray-900 dark:text-white">Select Voice:</label>
        <select
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          <option value="Joanna">Joanna (English-US)</option>
          <option value="Matthew">Matthew (English-US)</option>
          <option value="Ivy">Ivy (English-US)</option>
          <option value="Kendra">Kendra (English-US)</option>
        </select>

        <button
          onClick={handleListen}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg transform transition duration-300 hover:bg-blue-700 hover:scale-110"
        >
          {isConverting ? 'Converting...' : 'Listen'}
        </button>
      </div>

      {audioUrl && (
        <div className="mt-6">
          <audio controls src={audioUrl} className="w-full rounded-lg shadow-md">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default SavedBlogDetails;
