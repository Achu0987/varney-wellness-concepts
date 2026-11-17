/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: '#080E20', 'navy-2': '#0D1630', 'navy-3': '#141F44', violet: '#7557FF', ice: '#8BDFFF', cool: '#AAB6C8' },
      fontFamily: {
        display: ['"Clash Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        body: ['Satoshi', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
