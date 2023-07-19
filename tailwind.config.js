/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/apps/extension/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#011D25",
        light: "#C9C9EE",
        seductive: "#ec4899",
        accent: "#DCFFF3",
        white: "#fafafa",
        primary: "#00aff0",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
