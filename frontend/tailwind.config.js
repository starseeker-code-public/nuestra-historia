/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        prose: ['"Crimson Pro"', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.5s ease-out both',
        'float': 'float 4s ease-in-out infinite',
        'drift': 'drift 9s ease-in-out infinite',
        'pulse-heart': 'pulseHeart 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drift: {
          '0%': { opacity: '0', transform: 'translateY(0) rotate(-8deg)' },
          '15%': { opacity: '0.45' },
          '85%': { opacity: '0.2' },
          '100%': { opacity: '0', transform: 'translateY(-70px) rotate(8deg)' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      boxShadow: {
        rose: '0 4px 20px -4px rgba(244,63,94,0.18)',
        'rose-lg': '0 8px 32px -8px rgba(244,63,94,0.24)',
        warm: '0 2px 16px -4px rgba(120,40,30,0.08)',
        'warm-lg': '0 6px 32px -6px rgba(120,40,30,0.13)',
      },
    },
  },
  plugins: [],
}
