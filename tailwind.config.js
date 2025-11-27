/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#01acb4',
        background: '#212730',
        inputbg: '#1f2730',
        textlight: '#212730',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // modern sans
        display: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
