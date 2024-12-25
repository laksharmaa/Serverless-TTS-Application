import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Card({ blog, onDelete, isDeletable, linkTo }) {
  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={linkTo} state={{ blog }}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {blog.blogTitle || 'Untitled Blog'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {blog.blogContent.length > 150
            ? `${blog.blogContent.substring(0, 150)}...`
            : blog.blogContent}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>By: {blog.username || 'Unknown'}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </Link>
      {isDeletable && (
        <motion.button
          onClick={() => onDelete(blog.blogId)}
          className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Delete
        </motion.button>
      )}
    </motion.div>
  );
}

export default Card;