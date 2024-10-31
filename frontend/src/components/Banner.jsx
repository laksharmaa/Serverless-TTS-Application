// src/components/Banner.jsx
import React from 'react';

const Banner = () => {
  return (
    <div className="w-full bg-yellow-400 text-gray-800 font-bold text-center fixed top-16 left-0 z-50 overflow-hidden opacity-65">
      <div className="whitespace-nowrap animate-marquee inline-block py-1">
        🚧 This website is under development. Kindly share your feedback at{' '}
        <a href="mailto:lakshya.00ls05@gmail.com" className="text-blue-600 underline hover:text-blue-800">
          lakshya.00ls05@gmail.com
        </a>
      </div>
    </div>
  );
};

export default Banner;
