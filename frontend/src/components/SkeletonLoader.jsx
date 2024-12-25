import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => {
  return (
    <motion.div
      className="relative bg-gray-300 dark:bg-gray-700 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-5/6 mb-2"></div>
      <div className="mt-4 bg-red-400 h-10 w-full rounded-lg"></div>
    </motion.div>
  );
};

export default SkeletonLoader;