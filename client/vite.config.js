import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "127.0.0.1", 
    proxy: {
      "/": { 
        target: "http://192.168.1.117:4000",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})