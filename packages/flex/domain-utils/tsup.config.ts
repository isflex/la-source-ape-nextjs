// https://antfu.me/posts/publish-esm-and-cjs

import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  external: ['node:crypto', 'psl'],
  // external: ['crypto-browserify'],
  ...options,
}))
