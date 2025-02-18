import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import Login from './routes/Login';
import TextToSpeech from './routes/TextToSpeech';
import Register from './routes/Register';
import Navbar from './components/Navbar';
import SavedBlogs from './routes/SavedBlogs';
import SavedBlogDetails from './routes/SavedBlogDetails';
import CreateBlog from './routes/CreateBlog';
import PublicBlogs from './routes/PublicBlogs';
import PublicBlogDetails from './routes/PublicBlogDetails';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Banner from './components/Banner';
import './index.css';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (

    

    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Banner/>
      <div className="flex-grow flex flex-col overflow-hidden"> {/* Adjust this line */}
        <div className="flex-grow overflow-y-auto h-full"> {/* Adjust this line */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <CreateBlog />,
      },
      {
        path: "/text-to-speech",
        element: <TextToSpeech />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/saved-blogs",
        element: <SavedBlogs />,
      },
      {
        path: "/saved-blogs/:blogId", // Add the route with the dynamic parameter
        element: <SavedBlogDetails />,
      },
      {
        path: "/create-blog",
        element: <CreateBlog />,  // Add the route for blog creation
      },
      {
        path: "/public-blogs",
        element: <PublicBlogs />,
      },
      {
        path: "/public-blog/:blogId",
        element: <PublicBlogDetails />, // Component for displaying single blog details
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
