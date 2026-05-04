/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aurvion-black': '#0a0a0a',
        'aurvion-dark': '#1a1a1a',
        'aurvion-gold': '#d4af37',
        'aurvion-gold-light': '#e5c76b',
        'aurvion-gold-dark': '#b8960c',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
