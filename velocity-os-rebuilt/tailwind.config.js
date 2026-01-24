/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D4FF',  // Evolve cyan/turquoise
          dark: '#7B61FF',      // Evolve purple
        },
        evolve: {
          cyan: '#00D4FF',
          purple: '#7B61FF',
        },
      },
    },
  },
  plugins: [],
}
