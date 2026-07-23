import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#070a11",
          surface: "#0d1322",
          card: "rgba(18, 26, 43, 0.7)",
          cardHover: "rgba(26, 37, 60, 0.8)",
          border: "rgba(255, 255, 255, 0.08)",
          borderGlow: "rgba(16, 185, 129, 0.3)",
          subtle: "#94a3b8",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
          glow: "rgba(16, 185, 129, 0.25)",
        },
        saffron: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          glow: "rgba(245, 158, 11, 0.25)",
        },
        accent: {
          cyan: "#06b6d4",
          purple: "#8b5cf6",
        }
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "neon-emerald": "0 0 25px -3px rgba(16, 185, 129, 0.3), 0 0 10px -2px rgba(16, 185, 129, 0.2)",
        "neon-saffron": "0 0 25px -3px rgba(245, 158, 11, 0.3), 0 0 10px -2px rgba(245, 158, 11, 0.2)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glow-subtle": "0 0 40px -10px rgba(16, 185, 129, 0.15)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), rgba(255, 255, 255, 0))",
        "card-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "emerald-gradient": "linear-gradient(135deg, #10b981 0%, #047857 100%)",
        "saffron-gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-spin": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
