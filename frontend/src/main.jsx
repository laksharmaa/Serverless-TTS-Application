import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import TextToSpeech from './pages/TextToSpeech';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/text-to-speech" element={<TextToSpeech />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
