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
  
  const proxyConfig = {
    '/api': {
      target: isDev 
        ? 'https://mollusk-creative-cockatoo.ngrok-free.app'
        : 'https://api.brilldaddy.com',
      changeOrigin: true,
      secure: !isDev,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }

  return {
    plugins: [react()],
    preview: {
      port: 4173,
      strictPort: true,
      proxy: proxyConfig
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: proxyConfig
    },
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