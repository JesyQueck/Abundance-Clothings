import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          deep: "#0D0B09",
          surface: "#141210",
          raised: "#1C1915",
        },
        gold: {
          primary: "#C8A84B",
          muted: "#8B6F2E",
        },
        text: {
          primary: "#F5F0E8",
          secondary: "#B0A898",
          muted: "#706860",
        },
        border: {
          subtle: "#2A2520",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Arial Black", "sans-serif"],
        sans: ["var(--font-dm-sans)", "Segoe UI", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      spacing: {
        4.5: "18px",
        18: "72px",
        22: "88px",
        26: "104px",
      },
    },
  },
  plugins: [],
};
export default config;
