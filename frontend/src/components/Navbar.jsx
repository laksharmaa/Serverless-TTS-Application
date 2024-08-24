import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold">Polly Blog</Link>
        <div className="flex space-x-4">
          <Link to="/text-to-speech" className="text-gray-300 hover:text-white">Text to Speech</Link>
          <Link to="/saved-blogs" className="text-gray-300 hover:text-white">Saved Blogs</Link>
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
