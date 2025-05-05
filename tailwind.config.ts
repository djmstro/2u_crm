import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#171619',
        primary: '#7642cb',
        secondary: '#4f46e5',
        accent: '#7642cb',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      borderRadius: {
        'xl': '1rem',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.primary'),
                opacity: '0.8',
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            h5: {
              color: theme('colors.white'),
            },
            h6: {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.white'),
            },
            code: {
              color: theme('colors.white'),
            },
            figcaption: {
              color: theme('colors.white/70'),
            },
            blockquote: {
              color: theme('colors.white/70'),
              borderLeftColor: theme('colors.primary'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
}

export default config 