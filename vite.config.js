import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: Set the base path for GitHub Pages deployment.
  // The value should be the repository name, including leading and trailing slashes.
  base: '/aa/', 
})