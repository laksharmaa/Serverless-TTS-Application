import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, Option, Spinner } from "@material-tailwind/react";

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceId, setVoiceId] = useState('Matthew');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleConvert = async () => {
    if (!text.trim()) {
      showNotification('Please enter some text to convert', 'error');
      return;
    }

    setIsConverting(true);
    setAudioUrl(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to use this feature', 'error');
        return;
      }

      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        setAudioUrl(audioUrl);
        showNotification('Successfully converted to speech!', 'success');
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      showNotification('Failed to convert text to speech', 'error');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      showNotification('Cannot save empty text', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to save', 'error');
        return;
      }

      const url = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${url}/api/save-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogContent: text }),
      });

      if (response.ok) {
        showNotification('Blog saved successfully!', 'success');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      showNotification('Failed to save blog', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white font-medium`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Text to Speech Converter
          </h1>

          <div className="space-y-6">
            {/* Voice Selection */}
            <div className="w-full">
              <Select
                label="Select Voice"
                value={voiceId}
                onChange={(value) => setVoiceId(value)}
                className="bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <Option value="Joanna">Joanna (Female)</Option>
                <Option value="Matthew">Matthew (Male)</Option>
                <Option value="Salli">Salli (Female)</Option>
                <Option value="Ivy">Ivy (Child)</Option>
                <Option value="Kendra">Kendra (US)</Option>
              </Select>
            </div>

            {/* Text Input */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 
                         dark:border-gray-600 text-gray-800 dark:text-white resize-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <span className="absolute bottom-2 right-2 text-sm text-gray-500">
                {text.split(/\s+/).filter(word => word.length > 0).length} words
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                         font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <><Spinner size="sm" /> Saving...</> : 'Save Blog'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConvert}
                disabled={isConverting}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                         font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isConverting ? <><Spinner size="sm" /> Converting...</> : 'Convert to Speech'}
              </motion.button>
            </div>

            {/* Audio Player */}
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <audio controls src={audioUrl} className="w-full" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TextToSpeech;