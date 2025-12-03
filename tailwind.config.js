/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'serene-teal': '#2A7886',
        'healing-green': '#5A8B7C',
        'hopeful-coral': '#E07A5F', // Darkened from #F9A487 for better visibility
        'soft-linen': '#F4F0E9',
        'deep-charcoal': '#343A40',
        'light-stone': '#DEE2E6',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}