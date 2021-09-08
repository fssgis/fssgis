import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['./components/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  darkMode: 'class',
  theme: {
  }
})
