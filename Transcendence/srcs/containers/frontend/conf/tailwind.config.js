/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'animate-shake',
    'text-red-500'
  ],
  theme: {
    extend: {
      backgroundImage: {
        "arcade": "url('/assets/images/backgrounds/arcade.png')",
        "coin-door": "url('/assets/images/login/coin_door.png')",
        "control-panel": "url('/assets/images/login/control_panel.png')",
        "wood-panel": "url('/assets/images/backgrounds/wood_panel.png')",
        "arcade-screen": "url('/assets/images/backgrounds/screen.svg')",
      }
    }
  },
  plugins: [],
};
