import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'; // Importing the logo from the assets folder

function Navbar({ isLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login page after logout
  };

  // Function to check if a route is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-opacity-80 p-4 sticky top-0 z-10 shadow-lg backdrop-blur-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="absolute mt-0.5 h-16 w-16 mr-3" /> {/* Logo */}
          {/* <span className="text-white font-bold text-2xl">Polly Blog</span> */}
        </Link>
        <div className="lg:hidden">
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
          <div className="flex flex-col lg:flex-row lg:space-x-6 lg:ml-auto">
            <Link
              to="/text-to-speech"
              className={`${
                isActiveLink('/text-to-speech') ? 'text-white font-bold' : 'text-gray-200'
              } hover:text-white block lg:inline-block mt-4 lg:mt-0 transition-transform transform hover:scale-105`}
            >
              Narrate Blog
            </Link>
            <Link
              to="/saved-blogs"
              className={`${
                isActiveLink('/saved-blogs') ? 'text-white font-bold' : 'text-gray-200'
              } hover:text-white block lg:inline-block mt-4 lg:mt-0 transition-transform transform hover:scale-105`}
            >
              Saved Blogs
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-200 hover:text-white block lg:inline-block mt-4 lg:mt-0 transition-transform transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${
                    isActiveLink('/login') ? 'text-white font-bold' : 'text-gray-200'
                  } hover:text-white block lg:inline-block mt-4 lg:mt-0 transition-transform transform hover:scale-105`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${
                    isActiveLink('/register') ? 'text-white font-bold' : 'text-gray-200'
                  } hover:text-white block lg:inline-block mt-4 lg:mt-0 transition-transform transform hover:scale-105`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
