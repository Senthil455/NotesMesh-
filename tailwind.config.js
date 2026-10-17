/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Merriweather Sans"', 'Poppins', 'Arial', 'sans-serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
