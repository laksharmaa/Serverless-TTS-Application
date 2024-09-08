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
    <header className="sticky inset-0 z-50  border-b border-slate-100 bg-opacity-50 backdrop-blur-lg">
      <nav className="flex mx-auto max-w-6xl gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 ">
        {/* Logo */}
        <div className="absolutex  items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16 w-16" />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden items-center justify-center gap-6 md:flex">
          <li className={`pt-1.5 font-medium ${isActiveLink('/text-to-speech') ? 'text-pink-400 font-bold' : 'text-white-700'}`}>
            <Link to="/text-to-speech">Narrate Blog</Link>
          </li>
          <li className={`pt-1.5 font-medium ${isActiveLink('/saved-blogs') ? 'text-pink-400   font-bold' : 'text-white-700'}`}>
            <Link to="/saved-blogs">Saved Blogs</Link>
          </li>
        </ul>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* User actions */}
        <div className="hidden items-center justify-center gap-6 md:flex">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white-700 hover:text-black font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={`font-medium ${isActiveLink('/login') ? 'rounded-md bg-gradient-to-br from-blue-600 to-blue-400 px-3 py-1.5 font-medium text-white shadow-md shadow-blue-400/50 transition-transform duration-200 ease-in-out hover:scale-105"' : 'text-white-700'}`}>
                Sign in
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

      {/* Mobile Menu */ }
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
              Sign in
            </Link>
            <Link
              to="/register"
              className="block bg-green-600 text-white rounded-md px-3 py-2 text-center"
              onClick={toggleMenu}
            >
              Sign up for free
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
