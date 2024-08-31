import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {

//       '/dev': 'https://ezlu71f5c0.execute-api.ap-south-1.amazonaws.com',
//     },
//   },
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dev': {
        target: 'https://ezlu71f5c0.execute-api.ap-south-1.amazonaws.com', // The Express server URL
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Remove `/api` prefix if needed
      }
    }
  }
});