import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "#08090A",
        surface: "#111315",
        elevated: "#171A1D",
        foreground: "#F3F3F1",
        muted: "#A2A7AE",
        border: "#212528",
        accent: {
          DEFAULT: "#7DD3FC",
          foreground: "#08090A",
        },
        // Warm accent — used for "New" / attention states, kept separate
        // from the cool `accent` so status colour and interactive colour
        // never compete for the same visual weight.
        warm: {
          DEFAULT: "#FBBF24",
          foreground: "#08090A",
        },
        success: {
          DEFAULT: "#34D399",
          foreground: "#08090A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose: "68ch",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(243,243,241,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,243,241,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
