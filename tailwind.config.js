/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stress: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}

