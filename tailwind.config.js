/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx}',
      './src/app/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          red: {
            600: '#ed1c24',
            700: '#c50000',
          },
        },
      },
    },
    plugins: [],
  }
  