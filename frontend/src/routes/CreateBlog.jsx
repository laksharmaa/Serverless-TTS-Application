import React, { useState } from 'react';

function CreateBlog() {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState(''); // Type of notification (success or error)
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setNotification('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification('You must be logged in to create a blog.');
      setNotificationType('error');
      setIsLoading(false);
      return;
    }

    if (!blogTitle.trim() || !blogContent.trim()) {
      setNotification('Blog title and content are required.');
      setNotificationType('error');
      setIsLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_BASE_URL; // Base URL for your API
      const response = await fetch(`${url}/api/create-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blogTitle,
          blogContent,
          isPublic: isPublic ? 'true' : 'false', // Convert to string 'true' or 'false'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNotification('Blog created successfully!');
        setNotificationType('success');
        
        // Reset form fields
        setBlogTitle('');
        setBlogContent('');
        setIsPublic(true);

        // Clear notification after a delay
        setTimeout(() => {
          setNotification('');
        }, 5000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'An error occurred while creating the blog.');
      }
    } catch (error) {
      setMessage('An error occurred while creating the blog.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-xl text-gray-900 dark:text-white text-center m-2">Create a New Blog</h1>

      {notification && (
        <div
          className={`p-2 rounded-lg mb-4 transition-all ${
            notificationType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}
        >
          {notification}
        </div>
      )}

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto flex flex-col space-y-6">
        <input
          type="text"
          id="blogTitle"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          placeholder="Enter blog title..."
        />

        <textarea
          id="blogContent"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          className="w-full h-[50vh] p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
          placeholder="Write your blog content..."
        />

        <div className="flex items-center">
          <label htmlFor="isPublic" className="mr-4 text-gray-900 dark:text-gray-200">Make Public:</label>
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto font-inter font-medium bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
