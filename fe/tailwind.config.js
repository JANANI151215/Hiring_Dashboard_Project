/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
        },
        purple: {
          600: "#8B5CF6",
        },
      },
    },
  },
  plugins: [],
};
