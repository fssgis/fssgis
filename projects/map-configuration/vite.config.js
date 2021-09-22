import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line no-undef
  root: __dirname,
  base: './',
  server: {
    host: '0.0.0.0',
    port: 8085,
  },
  plugins: [
    vue(),
  ],
})
