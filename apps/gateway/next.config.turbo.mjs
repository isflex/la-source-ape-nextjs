// Turbopack-compatible Next.js configuration
// Preserves essential cssLoaderOptions for design system compatibility

import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import fs, { writeFileSync } from 'node:fs'
import subprocess from 'node:child_process'
import { promisify } from 'node:util'
const execPromise = promisify(subprocess.exec)

import createMDX from '@next/mdx'
import camelCase from 'lodash/camelCase.js'

let _gitCommitSHA = ''
let _buildId = ''

async function getGitCommitSHA() {
  try {
    const result = await execPromise(`${process.env.FLEX_PROJ_ROOT}/bin/run-get-git-commit.sh`)
    const { stdout, stderr } = result
    if (stderr) Promise.reject(stderr)
    return Promise.resolve(stdout.trim())
  } catch (error) {
    console.warn('Could not get git commit SHA:', error.message)
    return 'dev-turbo'
  }
}
_gitCommitSHA = await getGitCommitSHA()

async function getBuildId() {
  try {
    const result = await execPromise(`git rev-parse --short HEAD`)
    const { stdout, stderr } = result
    if (stderr) Promise.reject(stderr)
    return Promise.resolve(stdout.trim())
  } catch (error) {
    console.warn('Could not get build ID:', error.message)
    return 'dev-turbo'
  }
}
_buildId = await getBuildId()

console.log(`🚀 Turbopack Config - Git Commit SHA:`, _gitCommitSHA)
console.log(`🚀 Turbopack Config - Build Id:`, _buildId)

// Simplified route generation for Turbopack compatibility
async function getActiveRoutes() {
  const regexFolderName = /\[|\]|\./g
  let routes = []

  try {
    routes = fs
      .readdirSync(path.resolve(__dirname, 'src/app'), { withFileTypes: true })
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name.replace(regexFolderName, ''))
      .filter((folder) => !folder.startsWith('layout') && folder !== 'api')
  } catch (error) {
    console.warn('Could not read app directory for routes:', error.message)
    routes = ['web-app', 'about', 'newsletter']
  }

  const jsonData = JSON.stringify(routes)

  try {
    writeFileSync('./routes.active.json', jsonData, 'utf8')
  } catch (error) {
    console.log('Could not write routes file (non-critical):', error.message)
  }
}

// Generate routes for Turbopack
await getActiveRoutes()

// Essential CSS loader options for design system compatibility
function cssLoaderOptions(modules) {
  const { getLocalIdent, ...others } = modules
  return {
    ...others,
    getLocalIdent: (context, _, exportName, options) => {
      const webFontRegex = new RegExp(/flexi-webfont/g)
      const customIdent = webFontRegex.test(exportName)
        ? `${exportName}__${_buildId}`
        : `${camelCase(exportName)}__${_buildId}`
      return customIdent
    },
    exportLocalsConvention: 'camelCase',
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  async rewrites() {
    let activeRoutes = ['about', 'newsletter', 'decouverte-des-metiers', 'game', 'games', 'home', 'privacy_policy', 'sondage', 'sondage-web-app', 'terms_of_service', 'todo']

    try {
      activeRoutes = JSON.parse(fs.readFileSync('./routes.active.json', 'utf8'))
    } catch (error) {
      console.warn('Using fallback routes for rewrites')
    }

    const excludedRoutes = activeRoutes.filter(route => route !== 'web-app')
    // Always exclude API routes from rewrite
    excludedRoutes.push('api', '_next', 'favicon.ico')
    const exclusionPattern = excludedRoutes.join('|')

    return [
      {
        source: `/((?!${exclusionPattern}).*)/:path*`,
        destination: '/web-app/$1/:path*',
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/qui-sommes-nous',
        destination: 'https://ecolelasource.org/une-ecole-active/role-des-parents/',
        permanent: false,
      },
      {
        source: '/helloasso',
        destination: 'https://www.helloasso.com/associations/association-des-parents-d-eleves-de-la-source-ecole-nouvelle/',
        permanent: false,
      },
    ]
  },

  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    FLEX_GATEWAY_NAME: process.env.FLEX_GATEWAY_NAME,
    FLEX_POKER_CLIENT_NAME: process.env.FLEX_POKER_CLIENT_NAME,
    FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST: process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST,
  },

  transpilePackages: [
    '@types/flexiness',
    '@flex-design-system/framework',
    '@flex-design-system/react-ts',
    '@flexiness/domain-utils',
    '@flexiness/domain-store'
  ],

  serverExternalPackages: [
    '@marp-team/marp-cli',
  ],

  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },

  reactStrictMode: false,

  generateBuildId: async () => {
    return _buildId
  },

  env: {
    NEXT_PUBLIC_BUILD_ID: _buildId
  },

  crossOrigin: 'anonymous',

  sassOptions: {
    implementation: 'sass-embedded',
    silenceDeprecations: ['legacy-js-api'],
  },

  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],

  // Limited webpack configuration for essential CSS processing only
  webpack: (config, options) => {
    // Only apply essential CSS loader modifications for design system
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      ?.oneOf?.filter((rule) => Array.isArray(rule.use)) || []

    rules.forEach((rule) => {
      if (Array.isArray(rule.use)) {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader')
            && !moduleLoader.loader?.includes('postcss-loader')
            && moduleLoader.options?.modules
          ) {
            moduleLoader.options = {
              ...moduleLoader.options,
              modules: cssLoaderOptions(moduleLoader.options.modules),
            }
          }
        })
      }
    })

    // Add essential SVG loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Updated Turbopack configuration using the stable format
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
}

// Export config without MDX for Turbopack compatibility
// MDX functionality will be reduced but core design system will work
export default nextConfig