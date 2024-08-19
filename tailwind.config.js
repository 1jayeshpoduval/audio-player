/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      width: {
        "[450px]": "450px",
        "[90%]": "90%",
      },
      height: {
        "[5px]": "5px",
      },
    },
  },
  plugins: [],
};
