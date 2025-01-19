import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: { postcss: './postcss.config.cjs' },
  server: { port: 3000 },
  build: {
    target: 'esnext',
    outDir: '../server/dist/public', // Output static files here
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
