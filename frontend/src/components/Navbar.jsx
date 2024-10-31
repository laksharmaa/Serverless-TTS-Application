// src/components/CustomNavbar.jsx
import React, { useState } from "react";
import { MagnifyingGlassIcon, Bars2Icon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Navbar, MobileNav, Typography, IconButton, Button } from "@material-tailwind/react";
import logo from "../assets/logo.png";
import DarkModeToggle from "./DarkModeToggle";
import { useTheme } from "../context/ThemeContext"; // Import theme context

function CustomNavbar({ isLoggedIn, onLogout }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isDarkMode } = useTheme(); // Get theme state from context

  // Toggle nav open state
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  return (
    <Navbar
      className={`sticky top-0 z-50 mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6 shadow-md opacity-80 ${
        isDarkMode ? "bg-gray-800 text-white border-0" : "bg-white text-gray-900"
      }`}
    >
      <div className="relative flex items-center justify-between">
        {/* Logo */}
        <Typography as={Link} to="/" className="mr-4 ml-2 flex items-center">
          <img src={logo} alt="Logo" className="max-h-10 object-contain mr-2" />
        </Typography>

        {/* Links */}
        <div className="hidden lg:flex space-x-4">
          <Link to="/text-to-speech" className="font-medium">
            Narrate Blog
          </Link>
          <Link to="/saved-blogs" className="font-medium">
            Saved Blogs
          </Link>
          <Link to="/public-blogs" className="font-medium">
            Public Blogs
          </Link>
        </div>

        {/* Search Icon, Dark Mode Toggle */}
        <div className="hidden lg:flex items-center space-x-4">
          <IconButton color="blue-gray" variant="text" size="sm">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </IconButton>
          <DarkModeToggle />
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="text"
              color={isDarkMode ? "white" : "gray"}
              onClick={onLogout}
            >
              Logout
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button size="sm" variant="gradient" color="blue">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="gradient" color="blue">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <MobileNav open={isNavOpen} className="overflow-scroll lg:hidden">
        <div className="flex flex-col space-y-2">
          <Link to="/text-to-speech" onClick={toggleIsNavOpen} className="font-medium">
            Narrate Blog
          </Link>
          <Link to="/saved-blogs" onClick={toggleIsNavOpen} className="font-medium">
            Saved Blogs
          </Link>
          <Link to="/public-blogs" onClick={toggleIsNavOpen} className="font-medium">
            Public Blogs
          </Link>
          <Link to="/search" onClick={toggleIsNavOpen} className="font-medium">
            <MagnifyingGlassIcon className="inline h-5 w-5 mr-1" /> Search
          </Link>
          {isLoggedIn ? (
            <span onClick={onLogout} className="font-medium cursor-pointer">
              Logout
            </span>
          ) : (
            <>
              <Link to="/login" onClick={toggleIsNavOpen} className="font-medium">
                Login
              </Link>
              <Link to="/register" onClick={toggleIsNavOpen} className="font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </MobileNav>
    </Navbar>
  );
}

export default CustomNavbar;
