/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "villa-white": "#f5f5f5", // Off-white for nav/background
        "villa-green": "#81C784", // Muted green for accents
        "villa-charcoal": "#333333", // Primary text color
        "villa-black": "#000000", // Emphasis text
      },
    },
  },
  plugins: [],
};