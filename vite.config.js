import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.PROD?'/dbcrafter_frontend':undefined //this is used by vite to set prefix on the static urls while creating the build
})
