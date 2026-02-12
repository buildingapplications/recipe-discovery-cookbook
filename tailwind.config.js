const { hairlineWidth } = require('nativewind/theme');
const nativewindPreset = require('nativewind/preset');
const tailwindcssAnimate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Recipe app custom colors
        terracotta: {
          DEFAULT: '#E07A5F',
          50: '#FDF5F3',
          100: '#FAE8E3',
          200: '#F5D0C6',
          300: '#EDB2A0',
          400: '#E8957B',
          500: '#E07A5F',
          600: '#D65A3A',
          700: '#B44427',
          800: '#8F3720',
          900: '#75301D',
        },
        sage: {
          DEFAULT: '#81B29A',
          50: '#F3F8F6',
          100: '#E7F1EC',
          200: '#CFE3D9',
          300: '#AFD0BF',
          400: '#81B29A',
          500: '#5D9A7B',
          600: '#487B62',
          700: '#3B6350',
          800: '#325143',
          900: '#2B4439',
        },
        cream: {
          DEFAULT: '#F4F1DE',
          50: '#FDFCF8',
          100: '#FAF8EF',
          200: '#F4F1DE',
          300: '#E8E2BE',
          400: '#DCD29E',
          500: '#D0C27E',
          600: '#BBA75A',
          700: '#9A8746',
          800: '#7D6D3A',
          900: '#665A32',
        },
        coral: {
          DEFAULT: '#F2CC8F',
          50: '#FDFAF3',
          100: '#FBF4E4',
          200: '#F7E8C9',
          300: '#F2D9A7',
          400: '#F2CC8F',
          500: '#EBBA6A',
          600: '#E3A545',
          700: '#C78A2E',
          800: '#A57027',
          900: '#875B22',
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'system-ui', 'sans-serif'],
        medium: ['Inter_500Medium', 'system-ui', 'sans-serif'],
        semibold: ['Inter_600SemiBold', 'system-ui', 'sans-serif'],
        bold: ['Inter_700Bold', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
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
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
