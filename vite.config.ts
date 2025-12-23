import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/PPL2026/' : '/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
}))
