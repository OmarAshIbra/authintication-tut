/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(146deg, #2d6c8a, #6f8f9e, #a6b3b3, #ddd9c7)",
      },
    },
  },
  plugins: [],
};
