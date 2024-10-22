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
    <header className="sticky inset-0 z-50 border-b border-slate-100 bg-opacity-50 backdrop-blur-lg h-16"> {/* Set navbar height */}
      <nav className="flex max-w-7xl mx-auto gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-0 h-full">
        {/* Logo */}
        <div className="items-center h-full">
          <Link to="/" className="h-full flex items-center"> {/* Center logo vertically */}
            <img
              src={logo}
              alt="Logo"
              className="max-h-28 object-contain"  // Constrain the height and maintain aspect ratio
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden items-center justify-center gap-6 md:flex">
          <li className={`font-medium ${isActiveLink('/text-to-speech') ? 'text-pink-400 font-bold' : 'text-white-700'}`}>
            <Link to="/text-to-speech">Narrate Blog</Link>
          </li>
          <li className={`font-medium ${isActiveLink('/saved-blogs') ? 'text-pink-400 font-bold' : 'text-white-700'}`}>
            <Link to="/saved-blogs">Saved Blogs</Link>
          </li>
          <li className={`font-medium ${isActiveLink('/public-blogs') ? 'text-pink-400 font-bold' : 'text-white-700'}`}>
            {/* Add this link to your existing Navbar */}
            <Link to="/public-blogs">Public Blogs</Link>
          </li>
        </ul>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* User actions */}
        <div className="hidden items-center justify-center gap-6 md:flex">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white-700 hover:text-pink-500 font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={`font-medium ${isActiveLink('/login') ? 'rounded-md bg-gradient-to-br from-blue-600 to-blue-400 px-3 py-1.5 font-medium text-white shadow-md shadow-blue-400/50 transition-transform duration-200 ease-in-out hover:scale-105"' : 'text-white-700'}`}>
                Login
              </Link>
              <Link
                to="/register"
                className={`font-medium ${isActiveLink('/register') ? 'rounded-md bg-gradient-to-br from-blue-600 to-blue-400 px-3 py-1.5 font-medium text-white shadow-md shadow-blue-400/50 transition-transform duration-200 ease-in-out hover:scale-105"' : 'text-white-700'}`}>
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="relative flex items-center justify-center md:hidden">
          <button type="button" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-auto text-white-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {
        isOpen && (
          <div className="md:hidden bg-white shadow-md p-4 space-y-2">
            <Link
              to="/text-to-speech"
              className="block text-gray-700 font-medium"
              onClick={toggleMenu}
            >
              Narrate Blog
            </Link>
            <Link
              to="/saved-blogs"
              className="block text-gray-700 font-medium"
              onClick={toggleMenu}
            >
              Saved Blogs
            </Link>
            <Link
              to="/public-blogs"
              className="block text-gray-700 font-medium"
              onClick={toggleMenu}
            >
              Blogs
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block text-gray-700 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 font-medium"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="backdrop-filter backdrop-blur-lg p-8 shadow-md block bg-indigo-500 text-white rounded-md px-3 py-2 text-center"
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )
      }
    </header >
  );
}

export default Navbar;
