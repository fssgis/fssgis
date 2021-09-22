import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  // eslint-disable-next-line no-undef
  root: './',
  base: '/fssgis-docs/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [
    WindiCSS()
  ],
  resolve: {
    alias: [
      { find: /^(@arcgis\/core)(.*)$/, replacement: 'http://172.16.0.103/esriCore/v4.20.2/$1$2.js' },
    ],
  },
})
