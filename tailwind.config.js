/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'typing': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'slide-left': {
          '0%': { marginLeft: '100%', width: '300%' },
          '100%': { marginLeft: '0%', width: '100%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(242, 84, 84, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(242, 84, 84, 0.5)' },
        },
      },
      animation: {
        'scale-up': 'scale-up 0.5s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'typing': 'typing 3.5s steps(40, end)',
        'slide-left': 'slide-left 1s ease-out',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'fade-in-delay': 'fade-in 0.8s ease-out 0.2s forwards',
        'fade-in-delay-2': 'fade-in 0.8s ease-out 0.4s forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(242, 84, 84, 0.3)',
        'glow-lg': '0 0 30px rgba(242, 84, 84, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 