import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#08061a",
          800: "#0d0a24",
          700: "#141031",
          600: "#1b1642",
        },
        clay: {
          base: "#1d1846",
          light: "#251f57",
          dark: "#130f30",
        },
        violet: { glow: "#7c5cff" },
        cyan: { glow: "#37e5ff" },
        pink: { glow: "#ff5ca8" },
        ink: {
          DEFAULT: "#f2efff",
          muted: "#9b93c9",
          faint: "#6b638f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        clay: "2rem",
        "clay-lg": "2.75rem",
        "clay-sm": "1.25rem",
      },
      boxShadow: {
        clay: "12px 12px 28px rgba(5,3,18,0.65), -8px -8px 22px rgba(74,60,150,0.22), inset -6px -6px 14px rgba(5,3,18,0.5), inset 7px 7px 16px rgba(104,86,190,0.28)",
        "clay-sm": "6px 6px 16px rgba(5,3,18,0.6), -4px -4px 12px rgba(74,60,150,0.18), inset -3px -3px 8px rgba(5,3,18,0.45), inset 4px 4px 10px rgba(104,86,190,0.25)",
        "clay-inset": "inset 8px 8px 18px rgba(5,3,18,0.7), inset -6px -6px 14px rgba(104,86,190,0.2)",
        "clay-accent": "8px 10px 30px rgba(124,92,255,0.4), inset -3px -3px 8px rgba(20,10,60,0.4), inset 4px 4px 10px rgba(255,255,255,0.32)",
        glow: "0 0 45px rgba(124,92,255,0.35)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(4deg)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
