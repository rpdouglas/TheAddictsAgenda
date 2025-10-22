/** @type {import('tailwindcss').Config} */
export default {
  // CRITICAL: Tells Tailwind which files to scan for class names.
  // This must include all your HTML and JSX files.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define a custom font family that Tailwind can use globally
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // You can also customize colors, spacing, etc. here if needed.
    },
  },
  plugins: [],
}
