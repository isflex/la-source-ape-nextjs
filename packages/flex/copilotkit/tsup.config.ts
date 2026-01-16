import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: [
    'src/index.ts',
    'src/hooks/index.ts',
    'src/provider/index.ts',
    'src/runtime/index.ts',
    'src/actions/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@copilotkit/react-core',
    '@copilotkit/react-ui',
    '@copilotkit/runtime',
  ],
  ...options,
}));
