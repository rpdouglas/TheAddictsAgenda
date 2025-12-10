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
  const isProd = mode === 'production' || mode === 'host';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        // --- ADDED: Workbox Configuration ---
        workbox: {
          // 1. Forces the new SW to take control of all clients immediately.
          skipWaiting: true,
          // 2. Tells the new SW to take control of the page immediately.
          clientsClaim: true,
        },
        // ------------------------------------
        manifest: {
          name: "My Recovery Toolkit",
          short_name: "Recovery Toolkit",
          description: 'A recovery tool for tracking sobriety, journaling, and working the steps.',
          theme_color: '#ffffff',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          icons: [
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
          ]
        }
      })
    ],
      
    base: getBase(mode),
    
    // --- BUILD OPTIMIZATION (UPDATED) ---
    build: {
      chunkSizeWarningLimit: 1500, // Increased to 1.5MB to silence warnings for the main vendor chunk
      minify: 'terser', // Ensure Terser is used for minification
      terserOptions: {
        compress: {
          // CRITICAL FIX: DO NOT REMOVE console.log statements during build
          drop_console: false, 
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 1. Separate large PDF libraries (Largest bottleneck)
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf-libs';
              }
              // 2. Separate Recharts (Large charting library)
              if (id.includes('recharts')) {
                return 'recharts';
              }
              // 3. Separate Firebase (Large SDK)
              if (id.includes('firebase')) {
                return 'firebase';
              }
              
              // REMOVED: 'vendor-react' chunking. 
              // Letting Vite bundle React automatically fixes the "B.Activity" undefined error.
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