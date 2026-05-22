/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#111111',
        border: '#222222',
        brand: '#6366F1',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        text: '#FAFAFA',
        muted: '#71717A',
      },
    },
  },
  plugins: [],
}
