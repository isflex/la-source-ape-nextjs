/*
*
https://eslint.org/docs/latest/extend/custom-processors
We will need to develope a custom processor inorder :
 - Show all level of linter messages when running -> pnpm lint
 - Only show error level linter messages when running -> pnpm build
 - Better usage of eslint cache if possible.
*
*/

import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsonI18nPlugin from 'eslint-plugin-i18n-json'
import reactPlugin from 'eslint-plugin-react'
import jsoncParser from 'jsonc-eslint-parser'
import hooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'
import { fixupPluginRules } from '@eslint/compat'

const { rulesBase, rulesReact, rulesTS, internalRegex, baseGlobals } = await import('./partials/index.js')

const eslintBaseTSConfig = defineConfig([
  globalIgnores([
    '**/dist/**',
    '**/build/**',
    '**/node_modules/**',
    '**/public/**',
    'bin/**',
    '**/amplify/**',
    '**/.amplify/**',
    '**/server.cjs',
    '.storybook/**',
    'package-lock.json',
    '**/webpack.config.js',
    '**/webpack.lib.config.js',
    '**/webpack.web.config.js',
    'setup.js',
    '**/cssnano.config.js',
    '**/gulpfile.js',
    '**/postcss.config.js',
    '**/rollup*.config.js',
    '**/lint.*.config.js',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ['apps/**/tsconfig*.build.json', 'packages/**/tsconfig*.build.json'],
        tsconfigRootDir: import.meta.dirname ? import.meta.dirname + '/../../../../../..' : process.cwd(),
      },
      globals: {
        ...baseGlobals,
      },
    },
  },
  {
    files: ['**/src/**/*.{ts,tsx,cts,mts}'],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(hooksPlugin),
    },
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
    },
    rules: {
      ...rulesBase,
      ...rulesTS,
      ...rulesReact,
      ...hooksPlugin.configs.recommended.rules,
      // Disable react/display-name due to ESLint 9 compatibility issue
      // context.getFirstTokens is not a function error
      'react/display-name': 'off',
    },
  },
  {
    files: ['apps/gateway/src/**/*.{ts,tsx,cts,mts}'],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(hooksPlugin),
      '@next/next': fixupPluginRules(nextPlugin),
    },
    settings: {
      next: {
        rootDir: 'apps/gateway',
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': ['off', 'apps/gateway'],
      // Disable react/display-name due to ESLint 9 compatibility issue
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(hooksPlugin),
    },
    rules: {
      ...rulesBase,
      ...rulesTS,
      ...rulesReact,
      'deprecation/deprecation': 'off',
      '@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      ...hooksPlugin.configs.recommended.rules,
      // Disable react/display-name due to ESLint 9 compatibility issue
      'react/display-name': 'off',
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
      'i18n-json': jsonI18nPlugin,
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
  eslintConfigPrettier,
])

export { eslintBaseTSConfig }
