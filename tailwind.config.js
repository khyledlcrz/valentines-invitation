/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 1s ease-in-out infinite",
        "pulse-slow": "pulse 2s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        "open-letter": "openLetter 0.8s ease-out forwards",
        "letter-zoom": "letterZoom 0.4s ease-in-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        openLetter: {
          "0%": {
            transform: "scale(0.8) translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1) translateY(0)",
            opacity: "1",
          },
        },
        letterZoom: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.3)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};
