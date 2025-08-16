import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F5F0E8", // Beige background
        },
        primary: {
          DEFAULT: "#8D674B", // Earthy brown for titles and text
        },
        secondary: {
          DEFAULT: "#D8A7B1", // Dusty rose for highlights
        },
        accent: {
          DEFAULT: "#E76F51", // Terracotta for buttons or special elements
        },
        muted: {
          DEFAULT: "#CBC5B9", // Warm gray for subtle text or borders
        },
        border: {
          DEFAULT: "#C2B6AE", // Light beige for borders or dividers
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
