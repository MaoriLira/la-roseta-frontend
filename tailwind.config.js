/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roseta-primary': '#be185d',
        'roseta-bg': '#fdf2f8',
      }
    },
  },
  plugins: [],
}