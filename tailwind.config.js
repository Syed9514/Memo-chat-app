import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
            // Add these properties for the slide-up animation
            keyframes: {
              "slide-up": {
              "0%": { transform: "translateY(100%)" },
              "100%": { transform: "translateY(0)" },
              },

              "slide-in-right": {
                "0%": { transform: "translateX(100%)" },
                "100%": { transform: "translateX(0)" },
              },
            
              // 1. Orb's idle "breathing"
              "pulse-glow": {
                "0%, 100%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 20px 0px hsl(var(--p))",
                },
                "50%": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 30px 10px hsl(var(--p) / 0.5)",
                },
              },
              // 2. Click ripple
              "wave-ripple": {
                "0%": { transform: "scale(0)", opacity: 1 },
                "100%": { transform: "scale(40)", opacity: 0 },
              },
              // 3. Message tag pop-in
              "pop-in": {
                "0%": { opacity: 0, transform: "translateY(10px) scale(0.9)" },
                "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
              },
              // 4. Finale animation
              "finale-spin-out": {
                "0%": { transform: "rotate(0deg) scale(1)", opacity: 1 },
                "100%": { transform: "rotate(360deg) scale(0)", opacity: 0 },
              },

            },

            animation: {
              "slide-up": "slide-up 0.3s ease-out forwards",
              "slide-in-right": "slide-in-right 0.3s ease-out forwards",
              "pulse-glow": "pulse-glow 4s ease-in-out infinite",
              "wave-ripple": "wave-ripple 1s ease-out forwards",
              "pop-in": "pop-in 0.3s ease-out forwards",
              "finale-spin-out": "finale-spin-out 1.5s ease-in-out forwards",
            },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
