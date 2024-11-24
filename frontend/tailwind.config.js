/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        width: "2px", 
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}