import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST || 'localhost';

export default defineConfig({
  plugins: [react()],
  css: { postcss: './postcss.config.cjs' },
  server: { host: HOST, port: PORT },
  build: {
    target: 'esnext',
    outDir: './dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
