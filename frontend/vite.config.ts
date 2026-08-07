import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Built assets are served by Django/Whitenoise from /static/react/ — same
// origin as the API, so no CORS needed in production.
export default defineConfig({
  base: '/static/react/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8001',
      '/media': 'http://127.0.0.1:8001',
    },
  },
})
