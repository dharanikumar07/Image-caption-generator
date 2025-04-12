/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Includes all relevant files
  ],
  theme: {
    extend: {
      colors: {
        navy: '#001f3d',
      },
    },
  },
  plugins: [],
}