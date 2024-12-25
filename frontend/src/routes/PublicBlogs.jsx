import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

function PublicBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const url = import.meta.env.VITE_API_BASE_URL;
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
          <Card
            key={blog.blogId}
            blog={blog}
            isDeletable={false}
            linkTo={`/public-blog/${blog.blogId}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PublicBlogs;