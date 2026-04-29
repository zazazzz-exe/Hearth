import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Fraunces'", "serif"],
        body: ["'Outfit'", "sans-serif"],
        headline: ["'Fraunces'", "serif"],
        label: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      colors: {
        ember: "#E8743C",
        "ember-soft": "#F4A877",
        "ember-deep": "#B85525",
        wood: "#3A2418",
        "wood-soft": "#5B3D2D",
        cream: "#FAF3E7",
        "cream-deep": "#F0E5D0",
        amber: "#FFC97A",
        "amber-soft": "#FFE0B0",
        warmgray: "#D9CFC2",
        success: "#5C8A3A",
        error: "#C44536",
        background: "#FAF3E7",
        white: "#FFFFFF"
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 201, 122, 0.55)",
        "ember-glow": "0 8px 22px rgba(232, 116, 60, 0.24), 0 0 28px rgba(255, 201, 122, 0.45)",
        card: "0 14px 36px rgba(58, 36, 24, 0.08)",
        "card-hover": "0 20px 48px rgba(58, 36, 24, 0.14)"
      },
      borderRadius: {
        card: "16px",
        button: "14px"
      }
    }
  },
  plugins: []
} satisfies Config;
