import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0c0e12",
        surface: "#14171f",
        "surface-raised": "#1a1e29",
        "surface-border": "#282e3e",
        chart: {
          bg: "#222222",
          axis: "#DDDDDD",
          grid: "#444444",
          border: "#71649C",
        },
        calm: {
          amber: {
            50: "#fffbeb",
            100: "#fef3c7",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            900: "#78350f",
            bg: "#2a2212",
            border: "#523e1b",
          },
          navy: {
            50: "#f0f4f8",
            100: "#d9e2ec",
            500: "#334e68",
            600: "#243b53",
            700: "#102a43",
            800: "#0b1d30",
            900: "#061320",
            accent: "#486581",
          },
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            800: "#166534",
            900: "#14532d",
            bg: "#0d2818",
            border: "#184e28",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
