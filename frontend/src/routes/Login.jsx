import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/dev/login';

    console.log('Fetching from URL:', url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        
        navigate('/text-to-speech');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-200 transition-colors duration-300">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-600 transition-colors duration-300 hover:scale-105 transform"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;