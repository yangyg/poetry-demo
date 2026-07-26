import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://poetry.palemoky.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
