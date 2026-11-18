/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: 'rgb(var(--c-ground) / <alpha-value>)',
        'navy-2': 'rgb(var(--c-surface) / <alpha-value>)',
        'navy-3': 'rgb(var(--c-raised) / <alpha-value>)',
        white: 'rgb(var(--c-ink) / <alpha-value>)',
        violet: 'rgb(var(--c-brand) / <alpha-value>)',
        'violet-mid': 'rgb(var(--c-brand-mid) / <alpha-value>)',
        'violet-deep': 'rgb(var(--c-brand-deep) / <alpha-value>)',
        ice: 'rgb(var(--c-accent) / <alpha-value>)',
        cool: 'rgb(var(--c-muted) / <alpha-value>)',
        paper: '#FFFFFF',
        lav: 'var(--c3-lav)', 'lav-2': 'var(--c3-lav-2)', 'lav-3': 'var(--c3-lav-3)',
        pur: 'var(--c3-pur)', 'pur-2': 'var(--c3-pur-2)', 'pur-3': 'var(--c3-pur-3)',
        cor: 'var(--c3-cor)', 'cor-2': 'var(--c3-cor-2)', off: 'var(--c3-off)', gra: 'var(--c3-gra)',
      },
      fontFamily: {
        display: ['"Clash Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        body: ['Satoshi', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
