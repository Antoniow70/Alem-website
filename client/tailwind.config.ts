import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          bigStone: "#1B314C",
          eastBay: "#5e6770ff",
          horizon: "#2563eb",
          poloBlue: "#2563eb",
        },
        dark: {
          bg: "#0B1220",
          surface: "#111C2E",
          text: "#E6EDF3",
          muted: "#9FB3C8",
          accent: "#5E82AC",
        },
        whatsapp: {
          primary: "#25D366",
          dark: "#128C7E",
        },
        feedback: {
          error: "#EF4444",
          errorLight: "#FEF2F2",
          errorBorder: "#FECACA",
          warning: "#F59E0B",
          warningLight: "#FFFBEB",
          warningBorder: "#FDE68A",
          warningText: "#92400E",
          warningMuted: "#78350F",
          success: "#22C55E",
          successLight: "#F0FDF4",
          successBorder: "#BBF7D0",
          info: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      }
    }
  },
  plugins: [],
} satisfies Config;
