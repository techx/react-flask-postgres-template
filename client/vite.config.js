import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9123,
    host: true,
    // proxy: {
    //  '/api': {
    //     target: 'http://127.0.0.1:9000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //  }
    // }
  }
})
