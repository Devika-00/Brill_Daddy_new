import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const isPreview = command === 'serve' && mode === 'production'

  const proxyTarget = isDev 
    ? 'https://mollusk-creative-cockatoo.ngrok-free.app'
    : 'https://api.brilldaddy.com'

  const proxyConfig = {
    '/api': {
      target: proxyTarget,
      changeOrigin: true,
      secure: !isDev,
      ws: true,
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          console.log('proxy error', err);
        });
        proxy.on('proxyReq', (proxyReq, req, res) => {
          // Modify the origin header
          proxyReq.setHeader('origin', proxyTarget);
          // Prevent caching
          proxyReq.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          proxyReq.setHeader('Pragma', 'no-cache');
          proxyReq.setHeader('Expires', '0');
          console.log('Sending Request to the Target:', req.method, req.url);
        });
        proxy.on('proxyRes', (proxyRes, req, res) => {
          // Remove caching headers from response
          proxyRes.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
          proxyRes.headers['pragma'] = 'no-cache';
          proxyRes.headers['expires'] = '0';
          console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
        });
      }
    }
  }
  
  const serverConfig = {
    port: isDev ? 5173 : 4173,
    strictPort: true,
    proxy: proxyConfig,
    cors: false
  }
  
  return {
    plugins: [react()],
    preview: serverConfig,
    server: serverConfig,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'Constants': path.resolve(__dirname, './src/Constants.js')
      }
    },
    define: {
      'process.env': {}
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})