import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'error-handler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            next();
          } catch (e) {
            if (e.message.includes('URI malformed')) {
              // Silent the error by not throwing
              res.status(400).send('Bad Request');
              return;
            }
            throw e;
          }
        });
      }
    }
  ],
  server: {
    logLevel: 'silent',
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        credentials: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
})
