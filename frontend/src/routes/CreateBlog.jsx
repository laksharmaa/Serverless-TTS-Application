import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '../context/ThemeContext';

function CreateBlog() {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem('token')) {
      showNotification('Please login to create a blog', 'error');
      return;
    }

    if (!blogTitle.trim() || !blogContent.trim()) {
      showNotification('Title and content are required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/create-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          blogTitle,
          blogContent,
          isPublic: isPublic ? 'true' : 'false',
        }),
      });

      if (response.ok) {
        showNotification('Blog created successfully! 🎉', 'success');
        setBlogTitle('');
        setBlogContent('');
        setIsPublic(true);
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (error) {
      showNotification('Failed to create blog', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen py-8 px-4 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Animation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Create Your Blog
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Share your thoughts with the world
          </p>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                notification.type === 'success'
                  ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                  : 'bg-red-100 text-red-800 border-l-4 border-red-500'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Blog Title */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-lg shadow-sm"
          >
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter your blog title..."
              className={`w-full p-4 rounded-lg border-2 focus:ring-2 transition-all ${
                isDarkMode
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500'
                  : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500'
              }`}
            />
          </motion.div>

          {/* Rich Text Editor */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? 'quill-dark' : ''
            }`}
          >
            <ReactQuill
              theme="snow"
              value={blogContent}
              onChange={setBlogContent}
              modules={modules}
              formats={formats}
              className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}
            />
          </motion.div>

          {/* Controls */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Make Public
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white font-medium shadow-lg hover:shadow-xl
                       disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating...</span>
                </span>
              ) : (
                'Create Blog'
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default CreateBlog;