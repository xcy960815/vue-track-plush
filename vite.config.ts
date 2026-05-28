import vue2 from '@vitejs/plugin-vue2';
import { defineConfig, type Plugin } from 'vite';

const trackApiMock = (): Plugin => ({
  name: 'track-api-mock',
  configureServer(server) {
    server.middlewares.use('/track-api', (req, res) => {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(
          JSON.stringify({
            success: true,
            data: body ? JSON.parse(body) : null,
          }),
        );
      });
    });
  },
});

export default defineConfig({
  plugins: [vue2(), trackApiMock()],
  build: {
    outDir: 'demo-dist',
  },
});
