/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zone-bullseye': '#22C55E',
        'zone-inner': '#EAB308',
        'zone-outer': '#F97316',
        'team-a': '#3B82F6',
        'team-b': '#EF4444',
        'game-bg': '#0F172A',
        'game-surface': '#1E293B',
        'game-border': '#334155',
        'game-gold': '#E0AD42',
        'game-navy': '#0F1132',
        'game-red': '#B9373B',
        'game-cream': '#F1ECC2',
      },
    },
  },
  plugins: [],
}
