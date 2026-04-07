/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        mist: "#f3f7fb",
        brand: "#0f766e",
        ocean: "#0f172a",
        glow: "#dbeafe",
        success: "#15803d",
        danger: "#dc2626",
        warning: "#b45309"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.10)"
      },
      fontFamily: {
        display: ["Space Grotesk", "Segoe UI", "sans-serif"],
        body: ["Plus Jakarta Sans", "Segoe UI", "sans-serif"]
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(16, 185, 129, 0.16), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.96), rgba(239,246,255,0.95))"
      }
    }
  },
  plugins: []
};
