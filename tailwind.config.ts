import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./utility/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F5F0E8",
        },
        primary: {
          DEFAULT: "#8D674B",
        },
        secondary: {
          DEFAULT: "#D8A7B1",
        },
        accent: {
          DEFAULT: "#E76F51",
        },
        muted: {
          DEFAULT: "#CBC5B9",
        },
        border: {
          DEFAULT: "#C2B6AE",
        },
      },
    },
  },
  plugins: [],
};

export default config;