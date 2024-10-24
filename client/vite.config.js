import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: import.meta.env.IP,
    port: 3000
  }
})