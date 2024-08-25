import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">Polly Blog</Link>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.36 6.64a1 1 0 00-1.41 0L12 11.59 7.05 6.64a1 1 0 00-1.41 1.41L10.59 13l-5.05 5.05a1 1 0 001.41 1.41L12 14.41l5.05 5.05a1 1 0 001.41-1.41L13.41 13l5.05-5.05a1 1 0 000-1.41z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                />
              )}
            </svg>
          </button>
        </div>
        <div className={`lg:flex lg:items-center ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-col lg:flex-row lg:space-x-4 lg:ml-auto">
            <Link to="/text-to-speech" className="text-gray-300 hover:text-white block lg:inline-block mt-4 lg:mt-0">Text to Speech</Link>
            <Link to="/saved-blogs" className="text-gray-300 hover:text-white block lg:inline-block mt-4 lg:mt-0">Saved Blogs</Link>
            <Link to="/login" className="text-gray-300 hover:text-white block lg:inline-block mt-4 lg:mt-0">Login</Link>
            <Link to="/register" className="text-gray-300 hover:text-white block lg:inline-block mt-4 lg:mt-0">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
