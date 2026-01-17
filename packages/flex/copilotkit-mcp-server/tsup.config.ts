import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: false, // Skip DTS generation due to MCP SDK type complexity
  clean: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  bundle: true, // Bundle all local imports into single files
  splitting: false, // Don't split - ensures cli.js is self-contained
  external: ['@typescript-eslint/typescript-estree', '@modelcontextprotocol/sdk', 'glob', 'fs', 'path'],
});
