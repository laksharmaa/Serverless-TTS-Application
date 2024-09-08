import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication status
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Show login prompt
  const navigate = useNavigate(); // useNavigate hook to redirect

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false); // Set authentication status to false
      setLoading(false); // Stop loading
      setShowLoginPrompt(true); // Show login prompt
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
        setLoading(false); // End loading state
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setShowLoginPrompt(true); // Show login prompt if user is not logged in
      return;
    }

    const username = blogs[0]?.username;

    if (!username) {
      alert('Username not found.');
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
        body: JSON.stringify({ username, blogId }),
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

  // Skeleton loader component with matching size and layout
  const SkeletonLoader = () => (
    <div className="relative bg-gray-300 dark:bg-gray-700 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-pulse">
      <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-5/6 mb-2"></div>
      <div className="mt-4 bg-red-400 h-10 w-full rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-2xl text-gray-900 dark:text-white text-center mt-2 mb-2">Saved Blogs</h1>
      
      {/* Show login prompt if not authenticated */}
      {showLoginPrompt && (
        <div className="flex flex-col items-center justify-center my-8">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            You need to be logged in to view your saved blogs🙂.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transform transition duration-300 hover:bg-blue-800"
          >
            Log In
          </button>
        </div>
      )}
      
      {!isAuthenticated && !loading && (
        <p className="text-gray-700 dark:text-gray-300 text-center">Please log in to view your saved blogs.</p>
      )}

      {loading ? (
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display 6 skeleton loaders */}
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      ) : blogs.length === 0 ? (
        !showLoginPrompt && <p className="text-gray-700 dark:text-gray-300 text-center">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="relative bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <Link
                to={`/saved-blogs/${blog.blogId}`} // Dynamic route
                state={{ blog }} // Pass blog data through state
              >
                <p className="text-gray-900 dark:text-white mb-4">
                  <strong>Text:</strong> {blog.blogContent.split(' ').slice(0, 30).join(' ')}...
                </p>
                <span className="absolute bottom-2 right-2 text-gray-600 dark:text-gray-300 text-xs">
                  {new Date(blog.createdAt).toLocaleString()}
                </span>
              </Link>
              <button
                onClick={() => handleDeleteBlog(blog.blogId)}
                className="relative origin-bottom-left mt-4 bg-red-500 text-white py-2 px-4 rounded-lg transform transition duration-300 hover:bg-red-700 hover:scale-110"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedBlogs;
