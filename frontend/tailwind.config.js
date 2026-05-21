/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Green Palette
        'primary': {
          DEFAULT: '#2FB344',
          dark: '#1E8A31',
          light: '#4DC462',
          50: '#F0FDF4',
        },
        // Forest / Deep Green
        'forest': {
          DEFAULT: '#123D2A',
          light: '#1A5C3E',
          dark: '#0A2418',
        },
        // Mint / Fresh
        'mint': {
          DEFAULT: '#EAF7EC',
          dark: '#D8EEDa',
        },
        // Sage / Soft
        'sage': {
          DEFAULT: '#D8E8D2',
          dark: '#BDD4B5',
          light: '#EDF5EB',
        },
        // Lime Accent
        'lime': '#A8E063',
        // Ivory Background
        'ivory': '#FAF8F1',
        // Text Dark
        'text-dark': '#16251B',
        // Logo Green Reference
        'logo-green': '#7FA463',
        // Neutrals
        'charcoal': '#16251B',
        'muted': '#5A6B5E',
        'border-soft': '#D8E8D2',
        'warm-white': '#FFFFFF',
        // Status
        'success': '#2FB344',
        'warning': '#D97706',
        'danger': '#DC2626',
        // Legacy compat aliases
        'cream': '#FAF8F1',
        'sage-light': '#EDF5EB',
        'sage-dark': '#123D2A',
        'beige': '#D8E8D2',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'section': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(18, 61, 42, 0.06)',
        'card': '0 8px 32px rgba(18, 61, 42, 0.08)',
        'premium': '0 20px 60px rgba(18, 61, 42, 0.12)',
        'glow': '0 0 24px rgba(47, 179, 68, 0.25)',
        'glow-strong': '0 0 40px rgba(47, 179, 68, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2FB344 0%, #1E8A31 100%)',
        'gradient-forest': 'linear-gradient(135deg, #123D2A 0%, #1A5C3E 100%)',
        'gradient-lime': 'linear-gradient(135deg, #A8E063 0%, #2FB344 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(18,61,42,0.6) 0%, rgba(18,61,42,0.3) 50%, rgba(18,61,42,0.7) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 50%, rgba(18,61,42,0.85) 100%)',
        'gradient-mint': 'linear-gradient(135deg, #EAF7EC 0%, #D8E8D2 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(47, 179, 68, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(47, 179, 68, 0.6)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
