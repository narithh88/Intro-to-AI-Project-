import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@teachablemachine/image', '@tensorflow/tfjs'],
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    }
  }
})