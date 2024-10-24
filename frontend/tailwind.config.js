/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "orange-primary": "#FF0000",
        "orange-secondary": "#FF8938",
        "cream-primary" : "#E6A623"
      },
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}