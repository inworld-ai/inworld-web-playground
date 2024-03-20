import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
