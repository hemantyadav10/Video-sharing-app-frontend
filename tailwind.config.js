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
        'inset-select': 'inset 0 0 0 1px #b54548',
        'input-border': 'inset 0 0 0 1px #d9edff40',
        'input-focus': 'inset 0 0 0 1.5px #2870bd'
      },
      keyframes: {
        slideDown: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
      },
      animation: {
        slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
      backgroundImage: {
        'dashboard_bg': "url('/dashboard.webp')",
      },
    },
  },
  plugins: [],
}