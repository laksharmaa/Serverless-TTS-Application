import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './routes/Login';
import TextToSpeech from './routes/TextToSpeech';
import Register from './routes/Register';
import Navbar from './components/Navbar';
import SavedBlogs from './components/SavedBlogs';
import './index.css';
import './App.css';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex flex-col">
      <Navbar />
      <div className="flex-grow p-4">
        <Outlet />
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
        element: <TextToSpeech />,
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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
