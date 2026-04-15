import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: false,
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@amplify': path.resolve(__dirname, 'amplify'),
      '@root': path.resolve(__dirname),
    },
  },
});
