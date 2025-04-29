import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
      autoInstall: true
    })
  ],
  optimizeDeps: {
    exclude: ['@sveltejs/kit']
  },
  ssr: {
    noExternal: ['@sveltejs/kit']
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}); 