/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          light: '#E7EFE2',
          DEFAULT: '#7F9B6D',
          dark: '#5F7355',
        },
        cream: '#F8F6F0',
        'warm-white': '#FFFFFF',
        beige: '#E9E2D6',
        charcoal: '#263126',
        muted: '#6F776E',
        'border-soft': '#E9E2D6',
        success: '#5F7355',
        warning: '#d97706',
        danger: '#ba1a1a',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(38, 49, 38, 0.04)',
      }
    },
  },
  plugins: [],
}
