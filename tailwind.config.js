/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-select-time": "var(--color-orange)",
        "bg-current-time": "var(--color-blue)",
        "txt-primary": "var(--text-primary)",
        "color-summary" : "var(--bg-summary)",
      },
    },
  },
  plugins: [],
};
