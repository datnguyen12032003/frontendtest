/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Đường dẫn đến các file React
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Thêm font Roboto
        libre: ['"Libre Baskerville"', 'serif'], // Thêm font Libre Baskerville
      },
    },
  },
  plugins: [],
}
