import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/dev': 'http://localhost:3000',
      '/dev': 'https://k3ipgosbi1.execute-api.ap-south-1.amazonaws.com',
    },
  },
})
