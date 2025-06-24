/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6D28D9', // A deep violet for primary elements
        'secondary': '#D1D5DB', // A light gray for secondary elements
        'accent': '#FBBF24', // A warm yellow for highlights
        'background': '#F3F4F6', // A light gray background
        'text': '#374151', // A dark gray for text
        'error': '#EF4444', // Red for errors
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Modern sans-serif font
      },
      spacing: {
        '128': '32rem', // Custom spacing for larger elements
        '144': '36rem', // Additional spacing size
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)', // Custom shadow for subtle depth
      },
    },
  },
  plugins: [],
};
