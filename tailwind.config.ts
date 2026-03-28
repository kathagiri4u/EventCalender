import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#13131A',
        surface2: '#1C1C28',
        border: '#2A2A3A',
        'text-primary': '#F0F0F5',
        'text-secondary': '#9090A8',
        'text-muted': '#5A5A72',
        accent: '#FF6B35',
        'accent-hover': '#FF8C5A',
        'accent-glow': 'rgba(255, 107, 53, 0.3)',
        sport: {
          nfl: '#013369',
          nba: '#C9082A',
          mlb: '#002D72',
          nhl: '#000000',
          soccer: '#00A651',
          ncaa: '#FF8200',
          ufc: '#D20A0A',
          golf: '#006747',
          nascar: '#FFD700',
        },
      },
      fontFamily: {
        heading: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 107, 53, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
