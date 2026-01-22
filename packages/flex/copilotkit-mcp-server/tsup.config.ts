import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI entry - fully bundled for MCP server execution
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    dts: false,
    clean: true,
    sourcemap: true,
    target: 'es2022',
    outDir: 'dist',
    bundle: true,
    splitting: false,
    // Keep external packages that have CJS internals or need special handling
    external: [
      '@typescript-eslint/typescript-estree',
      '@modelcontextprotocol/sdk',
      'glob',
    ],
  },
  // Library exports - for programmatic use
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    target: 'es2022',
    outDir: 'dist',
    bundle: false, // Preserve module structure for library consumers
    clean: false, // Don't clean - first build already did
  },
]);
