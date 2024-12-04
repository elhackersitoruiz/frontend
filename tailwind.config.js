// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Para archivos en src
    './pages/**/*.{js,jsx,ts,tsx}', // Para archivos de página
    './components/**/*.{js,jsx,ts,tsx}', // Para componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

