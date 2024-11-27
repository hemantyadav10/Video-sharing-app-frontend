/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'inset-custom': 'inset 0 0 0 var(--text-field-border-width) #b54548',
        'inset-textarea': 'inset 0 0 0 var(--text-area-border-width) #b54548',
      },
    },
  },
  plugins: [],
}