import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PublicBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = import.meta.env.VITE_API_BASE_URL; // Base URL for your API
        const response = await fetch(`${url}/api/public-blogs`);

        if (response.ok) {
          const result = await response.json();
          setBlogs(result);
        } else {
          setError('Failed to fetch public blogs');
        }
      } catch (error) {
        setError('An error occurred while fetching public blogs.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading public blogs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Public Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        {blogs.map((blog) => (
          <Link 
            to={`/public-blog/${blog.blogId}`} 
            key={blog.blogId} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{blog.blogTitle}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {blog.blogContent.length > 150 ? `${blog.blogContent.substring(0, 150)}...` : blog.blogContent}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">By: {blog.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PublicBlogs;
