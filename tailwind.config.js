/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
      custom: ['Product Sans', 'sans'], // Replace 'YourFontName' with the actual font family name
    },},
  },
  plugins: [],
}