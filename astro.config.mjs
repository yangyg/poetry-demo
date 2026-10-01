import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://poetry.palemoky.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
