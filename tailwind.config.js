/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A5CFF',
          dark: '#614AD3',
          light: '#A78BFF'
        },
        dark: {
          DEFAULT: '#0F0F1C',
          lighter: '#1A1A2E',
          darker: '#0A0A15'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(138, 92, 255, 0.5)',
        'glow-lg': '0 0 30px rgba(138, 92, 255, 0.5)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
} 