/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px rgba(6,182,212,0.2), 0 0 20px rgba(6,182,212,0.2)',
        'neon-purple': '0 0 5px rgba(139,92,246,0.2), 0 0 20px rgba(139,92,246,0.2)',
        'neon-yellow': '0 0 5px rgba(250,204,21,0.2), 0 0 20px rgba(250,204,21,0.2)',
      },
    },
  },
  plugins: [],
};