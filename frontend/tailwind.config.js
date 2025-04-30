/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      blablamedark: {
        "primary": "#f9cb46",
        "primary-content": "#1c1b20",
        "secondary": "#ffc940",
        "secondary-content": "#1c1b20",
        "accent": "#ffaa2b",
        "accent-content": "#1c1b20",
        "neutral": "#0d0d0d",
        "neutral-content": "#ffffff",
        "base-100": "#1c1b20",
        "base-200": "#2e2c32",
        "base-300": "#3e3b44",
        "base-content": "#ffffff",
        "info": "#4caeff",
        "info-content": "#ffffff",
        "success": "#3ed7b3",
        "success-content": "#1c1b20",
        "warning": "#ffe564",
        "warning-content": "#1c1b20",
        "error": "#ff5757",
        "error-content": "#ffffff",
      }
    }],
  }
}
