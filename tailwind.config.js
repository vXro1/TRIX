/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4',
        secondary: '#3b82f6',
        accent: '#facc15',
        bgFuturista: '#0f172a',
        textFuturista: '#e0f2fe'
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace']
      },
      boxShadow: {
        'futurista': '0 10px 30px rgba(0, 255, 255, 0.25)'
      },
      borderRadius: {
        '3xl': '2rem',
        '4xl': '2.5rem'
      }
    },
  },
  plugins: [],
}
