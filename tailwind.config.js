/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans TC",
          "Microsoft JhengHei",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#17202a",
        steel: "#315268",
        frost: "#eef3f6",
        signal: "#b45309",
        danger: "#b42318",
      },
    },
  },
  plugins: [],
};
