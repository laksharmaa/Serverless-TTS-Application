import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to view your saved blogs.');
        return;
      }

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
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to delete a blog.');
      return;
    }

    const username = blogs[0]?.username;

    // console.log(blogs);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Saved Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300 text-center">No blogs found.</p>
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
                {/* <h2 className="text-lg font-bold">{blog.title}</h2> */}
                <p className="text-gray-900 dark:text-white mb-4">
                  <strong>Text:</strong> {blog.blogContent.split(' ').slice(0, 50).join(' ')}...
                </p>
                <span className="absolute bottom-2 right-2 text-gray-600 dark:text-gray-300 text-xs">
                  {new Date(blog.createdAt).toLocaleString()}
                </span>
              </Link>
              <button
                onClick={() => handleDeleteBlog(blog.blogId)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg transform transition duration-300 hover:bg-red-700 hover:scale-110"
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
