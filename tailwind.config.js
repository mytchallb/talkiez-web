/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'primary': '#fff000',
        'primary-light': '#f6e812',
        'gray-superlight': '#999999',
        'gray-light': '#666666',
        'gray-medium': '#363636',
        'gray-dark': '#1A1A1A',
        'blue': '#0096ff',
      },
    },
  },
  plugins: [],
}

