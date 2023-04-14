/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/*', './components/*'],
  theme: {
    extend: {
      colors: {
        'theme-blue': '#86A3B8',
        'theme-beige': '#E8D2A6',
        'theme-peach': '#F48484',
        'theme-red': '#F55050',
        'theme-dream': '#E97777'
      }
    },
  },
  plugins: [],
}
