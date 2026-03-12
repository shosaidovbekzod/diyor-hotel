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
        ink: "#111111",
        champagne: "#d4b16a",
        sand: "#f5efe4",
        olive: "#273127"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 25px 80px rgba(17, 17, 17, 0.14)"
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(212,177,106,0.25), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;
