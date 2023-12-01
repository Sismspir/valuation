/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'btnShadow': '0px 4px 8px rgba(0, 0, 0.4, 0.4)',
        'companyShadow': '-8px -8px -8px rgba(0, 0, 0.4, 0.4)'
      },
    },
    // screens: {
    //   'sm': '240px',
    //   'md': '560px',
    //   'lg': '1024px',
    // }
  },
  plugins: [],
}

