import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sb/webapp-api-client': path.resolve(__dirname, '../webapp-libs/webapp-api-client/src'),
      '@sb/webapp-core': path.resolve(__dirname, '../webapp-libs/webapp-core/src'),
      '@sb/webapp-notifications': path.resolve(__dirname, '../webapp-libs/webapp-notifications/src'),
      '@sb/webapp-tenants': path.resolve(__dirname, '../webapp-libs/webapp-tenants/src'),
    },
  },
  build: {
    outDir: '../../static/webapp',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/accounts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/auth/, '/api/auth'),
      },
      '/tenants': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
