import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import { useTheme } from '../context/ThemeContext';

function CreateBlog() {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();

  // Set up the editor with Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog content...',
        emptyNodeClass: 'placeholder:text-gray-400',
      }),
      OrderedList,
      BulletList,
    ],
    content: blogContent,
    onUpdate: ({ editor }) => {
      setBlogContent(editor.getHTML());
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(''); // Clear previous notifications
    setNotificationType('');
    setIsLoading(true); // Start loading
  
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification('You must be logged in to create a blog.');
      setNotificationType('error');
      setIsLoading(false);
      return;
    }
  
    if (!blogTitle.trim() || !blogContent.trim()) {
      setNotification('Blog title and content are required.');
      setNotificationType('error');
      setIsLoading(false);
      return;
    }
  
    try {
      const url = import.meta.env.VITE_API_BASE_URL; // Ensure this is set in your .env file
      const response = await fetch(`${url}/api/create-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blogTitle,
          blogContent,
          isPublic: isPublic ? 'true' : 'false',
        }),
      });
  
      if (response.ok) {
        setNotification('Blog created successfully!');
        setNotificationType('success');
        setBlogTitle('');
        setBlogContent('');
        setIsPublic(true);
        setTimeout(() => {
          setNotification('');
        }, 5000);
      } else {
        const errorData = await response.json();
        setNotification(errorData.error || 'An error occurred while creating the blog.');
        setNotificationType('error');
      }
    } catch (error) {
      setNotification('An error occurred while creating the blog.');
      setNotificationType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} px-4`}>
      <h1 className="text-xl text-center m-2">Create a New Blog</h1>

      {notification && (
        <div className={`p-2 rounded-lg mb-4 ${notificationType === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
        {/* Card for title input and editor */}
        <div className={`p-6 shadow-lg rounded-lg ${isDarkMode ? 'bg-neutral-800 text-gray-200' : 'bg-white text-gray-900'}`}>
          {/* Blog Title */}
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className={`w-full p-3 mb-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-neutral-800 text-gray-200 focus:ring-indigo-500' : 'bg-white text-gray-900 focus:ring-blue-500'}`}
            placeholder="Enter blog title..."
          />

          {/* Rich Text Editor */}
          <div className="rounded-lg overflow-hidden">
            <div id="hs-editor-tiptap">
              <div className={`flex gap-x-1 border-b p-2 ${isDarkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
                {/* Toolbar Buttons */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none dark:hover:bg-neutral-700 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
                    <path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none dark:hover:bg-neutral-700 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" x2="10" y1="4" y2="4"></line>
                    <line x1="14" x2="5" y1="20" y2="20"></line>
                    <line x1="15" x2="9" y1="4" y2="20"></line>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none dark:hover:bg-neutral-700 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="10" x2="21" y1="6" y2="6"></line>
                    <line x1="10" x2="21" y1="12" y2="12"></line>
                    <line x1="10" x2="21" y1="18" y2="18"></line>
                    <path d="M4 6h1v4"></path>
                    <path d="M4 10h2"></path>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-full hover:bg-gray-200 focus:outline-none dark:hover:bg-neutral-700 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" x2="21" y1="6" y2="6"></line>
                    <line x1="8" x2="21" y1="12" y2="12"></line>
                    <line x1="8" x2="21" y1="18" y2="18"></line>
                    <line x1="3" x2="3.01" y1="6" y2="6"></line>
                    <line x1="3" x2="3.01" y1="12" y2="12"></line>
                    <line x1="3" x2="3.01" y1="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Editor Content Area */}
              <EditorContent
                editor={editor}
                className={`h-[10rem] overflow-auto p-4 transition-all duration-200 placeholder-gray-400 ${
                  isDarkMode ? 'bg-neutral-900 text-gray-200' : 'bg-white text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Public Checkbox */}
        <div className="flex items-center my-4">
          <label htmlFor="isPublic" className="mr-4">Make Public:</label>
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-6 w-6 text-blue-600 border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
  type="submit"
  className={`py-3 px-4 flex justify-center items-center w-full md:w-auto text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none ${
    isLoading ? 'cursor-not-allowed' : ''
  }`}
  disabled={isLoading}
>
  {isLoading ? (
    <span className="animate-spin inline-block h-5 w-5 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </span>
  ) : (
    <>
      Create Blog
    </>
  )}
</button>

      </form>
    </div>
  );
}

export default CreateBlog;
