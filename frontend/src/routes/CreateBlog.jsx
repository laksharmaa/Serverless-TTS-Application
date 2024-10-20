import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [blogTitle, setTitle] = useState('');
  const [blogContent, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to create a blog.');
      setIsLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/create-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogTitle, blogContent, isPublic }),
      });

      if (response.ok) {
        setMessage('Blog created successfully!');
        navigate('/saved-blogs');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Error occurred while creating the blog.');
      }
    } catch (error) {
      setMessage('Error occurred while creating the blog.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-xl text-gray-900 dark:text-white text-center m-2">Create New Blog</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          placeholder="Enter blog blogTitle"
        />
        <textarea
          value={blogContent}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[50vh] p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none"
          placeholder="Write your blog blogContent..."
        />

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="form-checkbox"
          />
          <span>Make Public</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
