import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: false, // Skip DTS generation due to MCP SDK type complexity
  clean: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  external: ['@typescript-eslint/typescript-estree'],
  // Add shebang to cli.js
  esbuildOptions(options) {
    options.banner = {
      js: '#!/usr/bin/env node',
    };
  },
});
