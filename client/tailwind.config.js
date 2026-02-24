/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original game zone colors (from device.js)
        'zone-bullseye': '#5B8797',   // slate-blue center 4pts
        'zone-inner': '#DD5748',      // rust/red middle 3pts
        'zone-outer': '#E0AD42',      // gold outer 2pts
        // Team colors
        'team-a': '#97BDC9',          // soft blue (Left Brain)
        'team-b': '#DF6B50',          // coral (Right Brain)
        // Core game palette (from device.js)
        'game-bg': '#0F1132',
        'game-navy': '#0F1132',
        'game-navy-mid': '#2D2F50',
        'game-navy-hover': '#414364',
        'game-navy-text': '#033352',
        'game-cream': '#F1ECC2',
        'game-red': '#B9373B',
        'game-gold': '#E0AD42',
        'game-board': '#3F6F8E',
        'game-board-dark': '#174766',
        'game-teal': '#80AAB2',
        // Card bg palette (from colours.csv)
        'card-gold': '#E2AC43',
        'card-blue': '#97BDC9',
        'card-green': '#478E7C',
        'card-cream': '#DFD9D0',
        'card-pink': '#E5BAC2',
        'card-coral': '#DF6B50',
      },
      fontFamily: {
        'game': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
