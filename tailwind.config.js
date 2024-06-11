/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{css,js}"],
  theme: {
    extend: {
      colors: {
        black: "#000",
        white: "#fff",
        "house-green": "#006241",
        "dark-house-green": "#1E3932",
        "accent-green": "#01A862",
        "light-green": "#D4E9E2",
        gray: "#F7F7F7",
        "dark-gray": "#6A6A6A",
      },
      screens: {
        laptop: "1000px",
        tablet: "425px",
        mobile: "320px",
      },
    },
  },
  plugins: [],
};
