import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    viteTsconfigPaths(),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
