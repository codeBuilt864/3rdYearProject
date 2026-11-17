/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7B5CFF",    // New purple
        secondary: "#A66CFF",  // New light purple
        accent: "#A66CFF",     // Accent purple
        base: {
          100: "#1B1443",      // Dark purple
          200: "#3A1C71",      // Darker purple
          300: "#0F0C29",      // Even darker
          content: "#ffffff",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0F0C29 0%, #1B1443 50%, #3A1C71 100%)',
        'gradient-purple': 'linear-gradient(135deg, #3A1C71 0%, #1B1443 50%, #0F0C29 100%)',
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#7B5CFF",
          "primary-focus": "#6B4FFF",
          "primary-content": "#ffffff",
          "secondary": "#A66CFF",
          "secondary-focus": "#9660FF",
          "secondary-content": "#ffffff",
          "accent": "#A66CFF",
          "accent-focus": "#9660FF",
          "accent-content": "#ffffff",
          "neutral": "#3f3f46",
          "neutral-focus": "#27272a",
          "neutral-content": "#ffffff",
          "base-100": "#1B1443",
          "base-200": "#3A1C71",
          "base-300": "#0F0C29",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}
