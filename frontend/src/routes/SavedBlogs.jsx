import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../components/Card';
import SkeletonLoader from '../components/SkeletonLoader';

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      setShowLoginPrompt(true);
      return;
    }

    const fetchBlogs = async () => {
      try {
        const url = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${url}/api/get-blogs`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBlogs(Array.isArray(data) ? data : []);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'An error occurred while retrieving blogs.');
        }
      } catch (error) {
        alert('An error occurred while retrieving blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/delete-blog`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogId }),
      });

      if (response.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.blogId !== blogId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'An error occurred while deleting the blog.');
      }
    } catch (error) {
      alert('An error occurred while deleting the blog.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-2xl text-gray-900 dark:text-white text-center mt-2 mb-2">Saved Blogs</h1>

      {showLoginPrompt && (
        <div className="flex flex-col items-center justify-center my-8">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            You need to be logged in to view your saved blogs.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-800"
          >
            Log In
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300 text-center">No blogs found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <AnimatePresence>
            {blogs.map((blog) => (
              <Card
                key={blog.blogId}
                blog={blog}
                onDelete={handleDeleteBlog}
                isDeletable={true}
                linkTo={`/saved-blogs/${blog.blogId}`}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default SavedBlogs;