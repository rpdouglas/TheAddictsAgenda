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
  // For Firehosting deployment
 //return '/'
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: "My Recovery Toolkit",
          short_name: "Recovery Toolkit",
          description: 'A recovery tool for tracking sobriety, journaling, and working the steps.',
          theme_color: '#ffffff',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          icons: [
            // ADDED: Full icon configuration
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ] // End of icons array
        }
      })
    ],
      
    base: getBase(mode),
    
    // --- ADDED: Build Optimization to fix chunk size warning ---
    build: {
      chunkSizeWarningLimit: 1000, // Optional: Increase limit to 1MB to silence minor warnings
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split node_modules into separate chunks
            if (id.includes('node_modules')) {
              // 1. Separate large PDF libraries
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf-libs';
              }
              // 2. Separate Recharts (Charting library)
              if (id.includes('recharts')) {
                return 'recharts';
              }
              // 3. Separate Firebase
              if (id.includes('firebase')) {
                return 'firebase';
              }
              // 4. Separate React and core vendor libs
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              
              // Fallback for other node_modules
              return 'vendor'; 
            }
          }
        }
      }
    },

    // Vitest configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})