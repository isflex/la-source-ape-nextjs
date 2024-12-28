// __dirname is not defined in ES module scope
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import subprocess from 'node:child_process'
import { promisify } from 'node:util'
const execPromise = promisify(subprocess.exec)

import { Config } from 'next-recompose-plugins'

async function getGitCommitSHA() {
  if ('GIT_COMMIT_SHA' in process.env) {
    return process.env.GIT_COMMIT_SHA
  } else {
    const result = await execPromise(`git rev-parse --short HEAD`)
    const { stdout } = result
    if (!stdout) return result
    _gitCommitSHA = stdout.trim()
    // console.log(`Git Commit SHA :`, _gitCommitSHA)
    return _gitCommitSHA
  }
}

let _nonce = ''
let _gitCommitSHA = ''

// const mainConfig = (async () => {

//   await getGitCommitSHA()
//   /** @type {import('next').NextConfig} */
//   const nextConfig = {

//     serverRuntimeConfig: {
//       PROJECT_ROOT: __dirname,
//       FLEX_CSP_NONCE: _nonce,
//       FLEX_BUILD_ID: _gitCommitSHA,
//       FLEX_GATEWAY_NAME: process.env.FLEX_GATEWAY_NAME,
//       FLEX_POKER_CLIENT_NAME: process.env.FLEX_POKER_CLIENT_NAME,
//       FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST: process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST,
//     },

//     transpilePackages: [
//       '@types/flexiness',
//       '@flexiness/domain-utils',
//       '@flexiness/domain-store'
//     ],

//     reactStrictMode: true,

//     generateBuildId: async () => {
//       // You can, for example, get the latest git commit hash here
//       return _gitCommitSHA
//     },

//     webpack: (config, options) => {
//       const { isServer } = options
//       return {
//         ...config,
//         // target: isServer? 'async-node20' : 'browserslist:last 1 chrome version',

//         module: {
//           ...config.module,
//           rules: [
//             ...config.module.rules,
//             {
//               test: /\.svg$/,
//               use: ['@svgr/webpack'],
//             },
//           ],
//         },

//         plugins: [
//           ...config.plugins,
//         ],

//         experiments: {
//           css: true,
//           topLevelAwait: true,
//           // outputModule: true,
//           layers: true
//         },

//         infrastructureLogging: {
//           level: 'none',
//           // colors: true,
//           // level: 'verbose',
//           // debug: [/PackFileCache/]
//         },
//       }
//     },

//     // experimental: {
//     //   turbo: {
//     //     rules: {
//     //       '*.svg': {
//     //         loaders: ['@svgr/webpack'],
//     //         as: '*.js',
//     //       },
//     //     },
//     //   },
//     // },
//   }
// })

const mainConfig = new Config(async (phase, args) => {
  await getGitCommitSHA()

  /** @type {import('next').NextConfig} */
  const nextConfig = {

    serverRuntimeConfig: {
      PROJECT_ROOT: __dirname,
      FLEX_CSP_NONCE: _nonce,
      FLEX_BUILD_ID: _gitCommitSHA,
      FLEX_GATEWAY_NAME: process.env.FLEX_GATEWAY_NAME,
      FLEX_POKER_CLIENT_NAME: process.env.FLEX_POKER_CLIENT_NAME,
      FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST: process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST,
    },

    transpilePackages: [
      '@types/flexiness',
      '@flexiness/domain-utils',
      '@flexiness/domain-store'
    ],

    reactStrictMode: true,

    generateBuildId: async () => {
      // You can, for example, get the latest git commit hash here
      return _gitCommitSHA
    },

    webpack: (config, options) => {
      const { isServer } = options
      return {
        ...config,
        // target: isServer? 'async-node20' : 'browserslist:last 1 chrome version',

        module: {
          ...config.module,
          rules: [
            ...config.module.rules,
            {
              test: /\.svg$/,
              use: ['@svgr/webpack'],
            },
          ],
        },

        plugins: [
          ...config.plugins,
        ],

        experiments: {
          css: true,
          topLevelAwait: true,
          // outputModule: true,
          layers: true
        },

        infrastructureLogging: {
          level: 'none',
          // colors: true,
          // level: 'verbose',
          // debug: [/PackFileCache/]
        },
      }
    },

    // experimental: {
    //   turbo: {
    //     rules: {
    //       '*.svg': {
    //         loaders: ['@svgr/webpack'],
    //         as: '*.js',
    //       },
    //     },
    //   },
    // },
  }

  return nextConfig
})
.build()

export default mainConfig
