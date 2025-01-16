/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'primary': '#fff000',
        'primary-light': '#f6e812',
        'gray-superlight': '#999999',
        'gray-light': '#666666',
        'gray-medium': '#242424',
        'gray-dark': '#1A1A1A',
        'blue': '#0096ff',
      },
    },
  },
  plugins: [],
}

