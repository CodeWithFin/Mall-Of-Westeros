/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A2A1F',
        paper: '#F8F4E8',
        acid: '#D2E823',
        stone: '#E5E0D6',
      },
      fontFamily: {
        display: ['Dela Gothic One', 'cursive'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #0A2A1F',
        'hard-sm': '2px 2px 0px 0px #0A2A1F',
        'hard-xl': '8px 8px 0px 0px #0A2A1F',
        'hard-acid': '4px 4px 0px 0px #D2E823',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
