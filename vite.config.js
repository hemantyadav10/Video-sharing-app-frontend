import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return {
    plugins: [react()],
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger']
    } : {}
  }
})