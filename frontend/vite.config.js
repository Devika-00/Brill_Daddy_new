import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'
  const isPreview = command === 'serve' && mode === 'production'

  // Configure proxy target based on environment
  const proxyTarget = isDev 
    ? 'http://localhost:5000'  // Local development backend
    : 'https://api.brilldaddy.com'

  const proxyConfig = {
    '/api': {
      target: proxyTarget,
      changeOrigin: true,
      secure: !isDev,
      ws: true,
      configure: (proxy, options) => {
        // Error handling
        proxy.on('error', (err, req, res) => {
          console.log('proxy error', err);
        });

        // Request handling
        proxy.on('proxyReq', (proxyReq, req, res) => {
          proxyReq.setHeader('origin', proxyTarget);
          
          // Development specific headers
          if (isDev) {
            proxyReq.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            proxyReq.setHeader('Pragma', 'no-cache');
            proxyReq.setHeader('Expires', '0');
          }
          
          console.log('Proxying request:', req.method, req.url, 'to', proxyTarget);
        });

        // Response handling
        proxy.on('proxyRes', (proxyRes, req, res) => {
          if (isDev) {
            proxyRes.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
            proxyRes.headers['pragma'] = 'no-cache';
            proxyRes.headers['expires'] = '0';
          }
          console.log('Received response:', proxyRes.statusCode, req.url);
        });
      }
    },
    // Separate WebSocket proxy configuration for development
    ...(isDev && {
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true
      }
    })
  }

  const serverConfig = {
    port: isDev ? 5173 : 4173,
    strictPort: true,
    proxy: proxyConfig,
    cors: isDev, // Enable CORS in development
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    }
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
      assetsDir: 'assets',
      sourcemap: isDev
    },
    // Development specific options
    ...(isDev && {
      optimizeDeps: {
        include: ['react', 'react-dom']
      },
    })
  }
})