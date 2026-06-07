import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/coach': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/coach/, '/v1beta/models/gemini-2.0-flash:generateContent'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
              if (apiKey) {
                proxyReq.setHeader('x-goog-api-key', apiKey)
              }
            })
          },
        },
      },
    },
  }
})
