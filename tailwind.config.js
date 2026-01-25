/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#42e4cb',
          500: '#38d9c0',
          600: '#2ec4ab',
        }
      }
    },
  },
  plugins: [],
}
