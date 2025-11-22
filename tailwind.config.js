/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
         colors: {
          primary: '#01acb4',
          background: '#212730',
          inputbg: '#1f2730',
          textlight: '#e6e6e6',
      },
    },
  },
  plugins: [],
}

