/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      width: {
        "[400px]": "400px",
        "[90%]": "90%",
      },
      height: {
        "[5px]": "5px",
      },
    },
  },
  plugins: [],
};
