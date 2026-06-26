/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', "Inter", "sans-serif"],
        dafoe: ['"Mr Dafoe"', "cursive"],
      },
    },
  },
  plugins: [],
};
