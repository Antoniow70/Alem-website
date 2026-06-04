/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            DEFAULT: '#2563eb', // Azul primário (blue-600)
            hover: '#1d4ed8',   // Blue-700
            dark: '#1e40af',    // Blue-800
            light: '#eff6ff',   // Blue-50
          },
          secondary: {
            DEFAULT: '#16a34a', // Verde secundário (green-600)
            hover: '#15803d',   // Green-700
            dark: '#166534',    // Green-800
            light: '#f0fdf4',   // Green-50
          },
          accent: {
            DEFAULT: '#facc15', // Amarelo de destaque (yellow-400)
            hover: '#eab308',   // Yellow-500
            dark: '#ca8a04',    // Yellow-600
            light: '#fef9c3',   // Yellow-100
          }
        }
      }
    },
  },
  plugins: [],
}
