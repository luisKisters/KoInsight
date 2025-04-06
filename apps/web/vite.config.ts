import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const PORT = Number(process.env.VITE_WEB_PORT ?? 3000);
  const HOST = process.env.VITE_WEB_HOST || 'localhost';

  return defineConfig({
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
};
