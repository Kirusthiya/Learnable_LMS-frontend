/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
       colors: {
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        accent: 'var(--color-accent)',
      },
    },
  },
  plugins: [],
}

