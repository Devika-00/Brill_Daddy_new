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
  
  return {
    plugins: [react()],
    preview: {
      port: 4173,
      strictPort: true,
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: isDev ? {
        '/api': {
          target: 'https://mollusk-creative-cockatoo.ngrok-free.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      } : import.meta.env.VITE_API_URL
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      'process.env': {}
    }
  }
})