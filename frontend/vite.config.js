import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
          if (id.includes('react-router-dom') || /node_modules[\\/]react(?:-dom)?[\\/]/.test(id)) return 'vendor';
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'state';
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('yup')) return 'form';
          if (id.includes('@tanstack')) return 'query';
          return undefined;
        },
      },
    },
  },
})
