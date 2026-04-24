import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['lol-strategy-mvp-production.up.railway.app'],
    host: true,
    port: process.env.PORT || 4173,
  }
})