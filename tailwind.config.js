import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        // Olive (primary brand). Semantic tokens — see design.md.
        brand: {
          DEFAULT: '#4A5D23',
          hover: '#3a4e1a',
          'on-dark': '#A8B97D',  // For use on bg-black / dark surfaces
          text: '#243510',       // Body text on AI tint
          heading: '#1a2609',    // Headings on AI tint
        },
        // Cream/warm-neutral surfaces.
        surface: {
          app: '#FCF9F8',        // App background, sticky bars, modal panels
          '2': '#F4F1EE',        // Pricing tables, amenity chips, tag bg
          ai: '#F4F7EC',         // AI Lifestyle Match, olive-accent info sections
          footer: '#F0EDEA',     // Landing page footer
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [typography],
};
