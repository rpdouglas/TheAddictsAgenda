/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Function to determine the base URL for the environment
const getBase = (mode) => {
  if (mode === 'development') {
    return '/'
  }
  // Replace 'your-repo-name' with the actual name of your GitHub repository
  return '/TheAddictsAgenda/'
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: "The Addict's Agenda",
          short_name: "Addict's Agenda",
          description: 'A recovery tool for tracking sobriety, journaling, and working the steps.',
          theme_color: '#ffffff',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          icons: [
            {
              "src": "/pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "/pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            }
          ]
        }
      })
    ],
    base: getBase(mode),
    // Vitest configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})