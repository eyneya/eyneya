/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#5B2D8E',
          'purple-dark': '#471F70',
          'purple-light': '#EDE8F5',
          'purple-tint': '#F6F2FB',
          gold: '#F5C844',
          'gold-dark': '#E0B233',
          'gold-light': '#FDF3D9',
          dark: '#1C1C2E',
          'dark-light': '#2A2A42',
          slate: '#6B7280',
          offwhite: '#F9F7F4',
          success: '#059669',
          error: '#DC2626',
          warning: '#D97706',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 25px -5px rgb(28 28 46 / 0.1), 0 8px 10px -6px rgb(28 28 46 / 0.05)',
        premium: '0 20px 60px -15px rgb(28 28 46 / 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
