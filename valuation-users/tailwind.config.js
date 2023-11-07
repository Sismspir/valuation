/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'btnShadow': '0px 4px 4px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

