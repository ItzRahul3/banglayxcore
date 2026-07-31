import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0a0d0a",
        surface: "#0f140f",
        panel: "#151b14",
        "panel-2": "#1b231a",
        border: "#243024",
        ore: {
          DEFAULT: "#55ff55",
          deep: "#2fae2f",
          dim: "#1f7a1f",
        },
        gold: {
          DEFAULT: "#e6b93c",
          bright: "#ffd873",
          deep: "#a87f22",
        },
        ink: {
          DEFAULT: "#e9f2e6",
          muted: "#93a390",
          faint: "#5c6b59",
        },
        danger: "#ff5555",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(85,255,85,0.06) 0%, rgba(10,13,10,0) 60%)",
        "noise": "url('/noise.png')",
      },
      boxShadow: {
        ore: "0 0 0 1px rgba(85,255,85,0.35), 0 0 24px rgba(85,255,85,0.12)",
        gold: "0 0 0 1px rgba(230,185,60,0.4), 0 0 24px rgba(230,185,60,0.15)",
        slot: "inset 0 0 0 2px rgba(0,0,0,0.6), inset 0 -3px 0 rgba(0,0,0,0.35), inset 0 3px 0 rgba(255,255,255,0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(85,255,85,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(85,255,85,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(85,255,85,0)" },
        },
        "scan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 40px" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
        scan: "scan 3s linear infinite",
      },
      clipPath: {
        notch: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
      },
    },
  },
  plugins: [],
};

export default config;
