import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import fs from 'fs';

const WAF_HOST = process.env.WAF_HOST || 'waf';
const WAF_PORT = process.env.WAF_PORT || 443;
const WAF_PROTOCOL = process.env.WAF_PROTOCOL || 'https';

// Leer certificados solo si existen (para evitar errores durante el build)
const certsPath = '/app/certs';
let httpsOptions = undefined;

if (fs.existsSync(`${certsPath}/frontend.key`)) {
  httpsOptions = {
    key: fs.readFileSync(`${certsPath}/frontend.key`, 'utf-8'),
    cert: fs.readFileSync(`${certsPath}/frontend.crt`, 'utf-8'),
    ca: fs.readFileSync(`${certsPath}/ca.crt`, 'utf-8')
  };
}

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['@babylonjs/core'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https: httpsOptions,
    proxy: httpsOptions ? {
      '/backend': {
        target: `${WAF_PROTOCOL}://${WAF_HOST}:${WAF_PORT}`,
        secure: true,
        ca: fs.readFileSync('/app/certs/ca.crt', 'utf-8')
      },
      '/game': {
        target: `${WAF_PROTOCOL}://${WAF_HOST}:${WAF_PORT}`,
        secure: true,
        ca: fs.readFileSync('/app/certs/ca.crt', 'utf-8')
      }
    } : {}
  },
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@Game': path.resolve(__dirname, '../src/components/Game'),
      '@': path.resolve(__dirname, '../src/')
    }
  }
});
