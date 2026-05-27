/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F3EEFF',
          secondary: '#EAF4FF',
          card: '#E9FFF3',
        },
        accent: {
          purple: '#7C3AED',
          'purple-light': '#9D5CF6',
          'purple-dark': '#5B21B6',
          cyan: '#06B6D4',
          'cyan-light': '#22D3EE',
          'cyan-dark': '#0891B2',
        },
        slate: {
          primary: '#1E293B',
          secondary: '#64748B',
          light: '#94A3B8',
          lighter: '#CBD5E1',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(124, 58, 237, 0.08)',
        'glass-lg': '0 16px 48px rgba(124, 58, 237, 0.12)',
        'glass-xl': '0 24px 64px rgba(124, 58, 237, 0.16)',
        glow: '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
};
