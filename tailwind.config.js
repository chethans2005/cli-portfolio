/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0e14',
          text: '#00ff41',
          cyan: '#00ffff',
          purple: '#bd93f9',
          glow: 'rgba(0, 255, 65, 0.5)',
        },
      },
    },
  },
  plugins: [],
}
