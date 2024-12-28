/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// import { Linter } from 'eslint'
// import globals from 'globals'
import tseslint, { type Config } from 'typescript-eslint'
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsonI18nPlugin from 'eslint-plugin-i18n-json'
import reactPlugin from 'eslint-plugin-react'
import jsoncParser from 'jsonc-eslint-parser'
import hooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'
// import jestPlugin from 'eslint-plugin-jest';

// import { FlatCompat } from '@eslint/eslintrc'
// import path from 'path'
// import { fileURLToPath } from 'url'
// // mimic CommonJS variables -- not needed if using CommonJS
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const compat = new FlatCompat({
//   baseDirectory: __dirname, // optional; default: process.cwd()
//   resolvePluginsRelativeTo: __dirname, // optional
// })

const { rulesBase, internalRegex, baseGlobals } = await import('./partials/index.js')

const eslintBaseTSConfig: Config = tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      'bin/**',
      'amplify/**',
      '**/server.cjs',
      'apps/la-source/ape/on-board/server/src/index.cjs',
      '**/design-system-react-ts/src/**/*.native.tsx',
    ],
  },
  {
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      'import/ignore': ['react', 'react-native'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.cjs', '.mjs'],
        },
        typescript: {
          alwaysTryTypes: true,
          extensions: ['.ts', '.tsx', '.cts', '.mts'],
          project: ['apps/**/tsconfig.build.json', 'packages/**/tsconfig.build.json'],
        },
      },
      'import/internal-regex': [...internalRegex],
      jest: {
        version: 29,
      },
      next: {
        rootDir: 'apps/la-source/ape/gateway',
      },
    },
  },
  eslint.configs.recommended,
  {
    files: ['**/src/*.ts', '**/src/*.tsx', '**/src/*.cts', '**/src/*.mts'],
    extends: [
      eslint.configs.recommended,
      // ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      // ...tseslint.configs.stylisticTypeChecked,
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
      // jest: jestPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        // project: true,
        project: ['apps/**/tsconfig*.build.json', 'packages/**/tsconfig*.build.json'],
        // eslint-disable-next-line camelcase
        EXPERIMENTAL_useProjectService: true,
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
      globals: {
        ...baseGlobals,
      },
    },
    rules: {
      ...rulesBase,
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': ['off', 'apps/la-source/ape/gateway'],
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    extends: [eslint.configs.recommended, tseslint.configs.disableTypeChecked],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
      // jest: jestPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        // project: true,
        project: ['apps/**/tsconfig*.build.json', 'packages/**/tsconfig*.build.json'],
        // eslint-disable-next-line camelcase
        EXPERIMENTAL_useProjectService: true,
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
      globals: {
        ...baseGlobals,
      },
    },
    rules: {
      ...rulesBase,
      // turn off other type-aware rules
      'deprecation/deprecation': 'off',
      '@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',

      // turn off rules that don't apply to JS code
      '@typescript-eslint/explicit-function-return-type': 'off',
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': ['off', 'apps/la-source/ape/gateway'],
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
  {
    files: ['**/locales/**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonI18nPlugin,
    },
    rules: {
      'i18n-json/valid-message-syntax': [
        2,
        {
          syntax: 'icu',
        },
      ],
      'i18n-json/valid-json': 2,
      'i18n-json/sorted-keys': [
        2,
        {
          order: 'asc',
          indentSpaces: 2,
        },
      ],
      'i18n-json/identical-keys': 0,
    },
  },
  // {
  //   // enable jest rules on test files
  //   files: ['test/**'],
  //   ...jestPlugin.configs['flat/recommended'],
  //   plugins: {
  //     jest: jestPlugin,
  //   },
  // },
  eslintConfigPrettier,
)

export { eslintBaseTSConfig }
