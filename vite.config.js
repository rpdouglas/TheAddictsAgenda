import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The base path for GitHub Pages deployment.
  base: './', 
  
  // REMOVED: The entire 'resolve' block has been deleted to prevent path conflicts.
})