import React, { useEffect, useState } from 'react';

function PublicBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPublicBlogs() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-blogs`);
        if (!response.ok) {
          throw new Error('Failed to fetch public blogs');
        }
        const data = await response.json();
        setBlogs(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchPublicBlogs();
  }, []);

  if (isLoading) {
    return <div>Loading public blogs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="public-blogs-container">
      <h1>Public Blogs</h1>
      {blogs.length === 0 ? (
        <p>No public blogs available.</p>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.blogId} className="blog-item">
              <h2>{blog.blogTitle}</h2>
              <p>{blog.blogContent.slice(0, 100)}...</p> {/* Preview of content */}
              <a href={`/public-blog/${blog.blogId}`} className="read-more">
                Read More
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicBlogs;
