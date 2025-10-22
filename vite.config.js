import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Set the base path for GitHub Pages deployment.
  // The value should be the repository name, including leading and trailing slashes.
  base: './', 
  
  // NEW CONFIGURATION: Define path aliases to resolve imports cleanly
  resolve: {
    alias: {
      'utils': path.resolve(__dirname, 'src/utils'),
      'components': path.resolve(__dirname, 'src/components'),
    },
  },
})
