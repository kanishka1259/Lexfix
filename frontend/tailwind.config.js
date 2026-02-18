/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#f2b880',
        'brand-cream': '#FAF7F2',
      }
    },
  },
  plugins: [],
}
