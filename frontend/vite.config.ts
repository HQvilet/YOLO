import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'path';
// import tailwindcss from 'tailwindcss'

// const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    port:80,
    proxy:{
      "/api":{
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
})
