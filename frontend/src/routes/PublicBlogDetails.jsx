import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PublicBlogDetails() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogDetails() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-blog/${blogId}`);
        if (!response.ok) throw new Error('Failed to fetch public blog details');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogDetails();
  }, [blogId]);

  if (isLoading) return <div className="text-center text-gray-500">Loading blog details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-6">
      {blog ? (
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blog.blogTitle}</h1>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {blog.blogContent}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Published by: <strong>{blog.username}</strong></span>
            <span>Posted on: {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Date not available'}</span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Blog not found.</p>
      )}
    </div>
  );
}

export default PublicBlogDetails;
