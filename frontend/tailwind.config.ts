import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161410",
        champagne: "#c2a36a",
        sand: "#f4efe7",
        olive: "#24312b",
        linen: "#ede6db",
        stone: "#8b7f70"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 24px 70px rgba(22, 20, 16, 0.08)"
      },
      backgroundImage: {
        "hero-glow": "linear-gradient(180deg, rgba(8, 8, 8, 0.18) 0%, rgba(8, 8, 8, 0.64) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
