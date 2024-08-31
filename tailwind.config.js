/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      width: {
        "[90%]": "90%",
      },
      maxWidth: {
        "[450px]": "450px",
      },
      height: {
        "[5px]": "5px",
      },
    },
  },
  plugins: [],
};
