/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const { rulesBase } = require('./partials/rules.js')
const { internalRegex } = require('./partials/internal-regex.js')

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:storybook/recommended',
    // 'plugin:jsonc/recommended-with-json',
    'plugin:jest/recommended',
    'plugin:cypress/recommended',
    // 'next',
    'plugin:@next/next/recommended',
    // 'plugin:prettier/recommended',
    'plugin:eslint-plugin-prettier/recommended',
  ],
  plugins: ['import', 'unused-imports', 'simple-import-sort', 'react', 'react-hooks', 'jest', 'cypress', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    project: [
      // 'tsconfig.build.json',
      // 'apps/*/tsconfig.build.json',
      // 'packages/*/tsconfig.build.json',
      // 'tsconfig.build.settings.json',
      // require.resolve('tsconfig/tsconfig.eslint.json'),
      'apps/**/tsconfig.build.json',
      'packages/**/tsconfig.build.json',
    ],
    // EXPERIMENTAL_useProjectService: true,
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    requireConfigFile: true,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    'jest/globals': true,
    'cypress/globals': true,
    es6: true,
  },
  globals: {
    __dirname: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/ignore': ['react', 'react-native'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // node: {
      //   extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.cts', '.mts'],
      // },
      // typescript: {
      //   alwaysTryTypes: true,
      //   extensions: ['.ts', '.tsx', '.cts', '.mts'],
      //   project: [
      //     // 'tsconfig.build.json',
      //     // 'apps/*/tsconfig.build.json',
      //     // 'packages/*/tsconfig.build.json',
      //     // require.resolve('tsconfig/tsconfig.eslint.json'),
      //     'apps/*/tsconfig.json',
      //     'packages/*/tsconfig.json',
      //   ],
      // },
      typescript: true,
      node: true,
    },
    'import/internal-regex': [...internalRegex],
    jest: {
      version: 29,
    },
    next: {
      rootDir: 'apps/la-source/ape/gateway',
    },
  },
  rules: {
    ...rulesBase,
    '@next/next/no-html-link-for-pages': 'off',
    semi: 'off',
    // semi': ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    // semi: ['error', 'always', { omitLastInOneLineBlock: true, omitLastInOneLineClassBody: true }],
    // 'prettier/prettier': [
    //   'error',
    //   {},
    //   {
    //     usePrettierrc: true,
    //   },
    // ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        tabWidth: 2,
        semi: false,
        printWidth: 150,
        parser: 'typescript',
      },
    ],
    // turn on errors for missing imports
    'import/default': 'off',
    // 'import/no-unresolved': 'warn',
    // 'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/no-unresolved': 'off',
    'import/no-default-export': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/export': 0,
    'import/no-named-as-default': 0,

    'no-unused-vars': 'off',
    // 'no-unused-vars': 'warn',

    // https://stackoverflow.com/questions/57802057/eslint-configuring-no-unused-vars-for-typescript
    '@typescript-eslint/no-unused-vars': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],

    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',

    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',

    '@typescript-eslint/no-misused-promises':  [
      'warn',
      {
        'checksVoidReturn': {
          'arguments': false,
          'attributes': false,
        }
      }
    ],
  },
  ignorePatterns: [
    '**/webpack.config.js',
    '**/Dockerfile',
    '**/README.md',
    '**/*.yaml',
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/public/',
    '**/.next/',
    '**/amplify/',
    '**/design-system-react-ts/src/**/*.native.tsx',
  ],
}
