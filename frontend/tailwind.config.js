/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "background": "rgb(var(--color-background) / <alpha-value>)",
        "surface": "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        "outline": "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        "primary": "rgb(var(--color-primary) / <alpha-value>)",
        "primary-fixed": "rgb(var(--color-primary-fixed) / <alpha-value>)",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        "secondary": "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        "tertiary": "rgb(var(--color-tertiary) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--color-tertiary-fixed) / <alpha-value>)",
        "tertiary-container": "rgb(var(--color-tertiary-container) / <alpha-value>)",
        "error": "rgb(var(--color-error) / <alpha-value>)",
        "on-background": "rgb(var(--color-on-surface) / <alpha-value>)",
        gray: {
          900: '#0A0908',
          800: '#151926',
          700: '#252B3B',
          600: '#384152',
          500: '#4B5563',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        indigo: {
          900: '#312E81',
          800: '#3730A3',
          700: '#4338CA',
          600: '#4F46E5',
          500: '#6366F1',
          400: '#818CF8',
          300: '#A5B4FC',
          200: '#C7D2FE',
          100: '#E0E7FF',
        },
        orchid: {
          400: '#da70d6',
          500: '#ba55d3',
        }
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
        "full": "9999px"
      },
      spacing: {
        "container-padding": "48px",
        "unit": "8px",
        "section-margin": "80px",
        "element-gap": "24px",
        "glass-blur": "40px"
      },
      fontFamily: {
        "body-md": ["var(--font-body)"],
        "label-md": ["var(--font-label)"],
        "body-lg": ["var(--font-body)"],
        "display-xl": ["var(--font-display)"],
        "headline-lg": ["var(--font-display)"],
        "headline-md": ["var(--font-display)"],
        "headline-xl": ["var(--font-display)"],
        "body-sm": ["var(--font-body)"],
        "label-caps": ["var(--font-label)"]
      },
      fontSize: {
        "body-md": ["16px", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "body-sm": ["14px", { "lineHeight": "1.5", "letterSpacing": "0em", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "1.4", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "label-caps": ["12px", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-xl": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700" }],
        "headline-xl": ["48px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-lg": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.03em", "fontWeight": "700" }],
        "headline-md": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }]
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },
    },
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('light', '.light &');
    },
  ],
};
