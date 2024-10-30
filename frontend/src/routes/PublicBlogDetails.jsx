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

  if (isLoading) return <div>Loading blog details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blog-details-container">
      {blog ? (
        <>
          <h1>{blog.blogTitle}</h1>
          <p>{blog.blogContent}</p>
          <p><strong>Published by:</strong> {blog.username}</p>
        </>
      ) : (
        <p>Blog not found.</p>
      )}
    </div>
  );
}

export default PublicBlogDetails;
