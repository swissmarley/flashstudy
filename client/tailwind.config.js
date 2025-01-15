/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // You can add custom styles, colors, transitions, etc. here
      colors: {
        'primary': '#312e81',
        'secondary': '#818cf8',
      }
    },
  },
  plugins: [],
};