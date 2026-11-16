import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
export default defineConfig({ plugins: [react()], server: { https: { cert: readFileSync(new URL('./.local/https/localhost.pem', import.meta.url)), key: readFileSync(new URL('./.local/https/localhost.pem', import.meta.url)) }, host: 'localhost', port: 3000, strictPort: true, proxy: {
            '/api/': { target: 'http://[::1]:8080', changeOrigin: true, configure(proxy) { proxy.on('error', (_err, _req, res) => { if ('writeHead' in res && !res.headersSent) {
                    res.writeHead(503, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'API upstream unavailable' }));
                } }); } },
            '/s3': { target: 'http://127.0.0.1:9000', changeOrigin: true, rewrite: path => path.replace(/^\/s3/, '') },
            '/api-static': { target: 'http://[::1]:8080', changeOrigin: true, rewrite: path => path.replace(/^\/api-static/, '/static') }
        } } });
