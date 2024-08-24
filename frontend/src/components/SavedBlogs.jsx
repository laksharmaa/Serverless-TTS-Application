import React, { useEffect, useState } from 'react';

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
        const response = await fetch('/dev/api/get-blogs', {
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

    // Get the username from the first blog item (assuming the user is the same for all blogs)
    const username = blogs[0]?.username;

    if (!username) {
      alert('Username not found.');
      return;
    }

    try {
      const response = await fetch(`/dev/api/delete-blog`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, blogId }),  // Include both username and blogId
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Saved Blogs</h1>
        {blogs.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300 text-center">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.blogId} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
              <p className="text-gray-900 dark:text-white mb-2"><strong>Text:</strong> {blog.blogContent}</p>
              {/* <audio controls src={blog.audioUrl} className="w-full rounded-lg shadow-sm" /> */}
              <button
                onClick={() => handleDeleteBlog(blog.blogId)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedBlogs;
