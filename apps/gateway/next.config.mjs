// __dirname is not defined in ES module scope
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// require.resolve for ES modules
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import subprocess from 'node:child_process'
import { promisify } from 'node:util'
const execPromise = promisify(subprocess.exec)

// import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import { Config } from 'next-recompose-plugins'

import camelCase from 'lodash/camelCase.js'

let _gitCommitSHA = ''
let _buildId = ''
async function getGitCommitSHA() {
  const result = await execPromise(`${process.env.FLEX_PROJ_ROOT}/bin/run-get-git-commit.sh`)
  const { stdout, stderr } = result
  if (stderr) Promise.reject(stderr)
  return Promise.resolve(stdout.trim())
}
_gitCommitSHA = await getGitCommitSHA()
console.log(`Git Commit SHA :`, _gitCommitSHA)
async function getBuildId() {
  const result = await execPromise(`git rev-parse --short HEAD`)
  const { stdout, stderr } = result
  if (stderr) Promise.reject(stderr)
  return Promise.resolve(stdout.trim())
}
_buildId = await getBuildId()
console.log(`Build Id :`, _buildId)

const mainConfig = new Config(async (phase, args) => {

  /** @type {import('next').NextConfig} */
  const nextConfig = {

    // https://nextjs.org/docs/pages/api-reference/config/next-config-js/rewrites
    // https://www.giovannibenussi.com/blog/redirects-and-rewrites-on-nextjs
    trailingSlash: true,
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/onboard/:path*',
        },
      ];
    },

    // ...(process.env.FLEX_MODE === 'production' && {
    //   async redirects() {
    //     return [
    //       // Basic redirect
    //       {
    //         source: `/:path*`,
    //         destination: `/onboard/:path*`,
    //         permanent: true,
    //       },
    //     ]
    //   },
    // }),

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
      // You can, for example, get the latest git commit hash here
      return _buildId
    },

    crossOrigin: 'anonymous',

    sassOptions: {
      implementation: 'sass-embedded',
      silenceDeprecations: ['legacy-js-api'],
    },

    webpack: (config, options) => {
      const { isServer } = options

      // https://www.youtube.com/watch?v=mqcUWfdiXUg
      // https://github.com/vercel/next.js/issues/71638#issuecomment-2464405044
      const regexEqual = (x, y) =>
        x instanceof RegExp &&
        y instanceof RegExp &&
        x.source === y.source &&
        x.global === y.global &&
        x.ignoreCase === y.ignoreCase &&
        x.multiline === y.multiline;

      function cssLoaderOptions(modules) {
        const { getLocalIdent, ...others } = modules;
        return {
          ...others,
          getLocalIdent: (context, _, exportName, options) => {
            // const localIdent = getLocalIdent(context, _, exportName, options);
            // return localIdent
            const customIdent = `${camelCase(exportName)}__${_gitCommitSHA}`
            return customIdent
          },
          exportLocalsConvention: 'camelCaseOnly',
        }
      }

      const oneOf = config.module.rules.find(
        (rule) => typeof rule.oneOf === 'object'
      )

      if (oneOf) {

        const moduleSassRule = oneOf.oneOf.find((rule) =>
          regexEqual(rule.test, /\.module\.(scss|sass)$/)
        )

        // console.log('moduleSassRule', moduleSassRule)

        if (moduleSassRule) {
          const cssLoader = moduleSassRule.use.find(({ loader }) =>
            loader.includes('css-loader')
          )
          if (cssLoader) {
            cssLoader.options = {
              ...cssLoader.options,
              modules: cssLoaderOptions(cssLoader.options.modules),
            }
            // console.log('cssLoader options', cssLoader.options)
          }
        }
      }

      // https://github.com/vercel/next.js/issues/12079
      // Find and remove NextJS css rules.
      // const cssRulesIdx = config.module.rules.findIndex(r => r.oneOf)
      // if (cssRulesIdx === -1) {
      //   throw new Error('Could not find NextJS CSS rule to overwrite.')
      // }
      // config.module.rules.splice(cssRulesIdx, 1)

      return {
        ...config,

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

        // /!\ Just don't
        // resolve: {
        //   plugins: [
        //     ...config.resolve.plugins,
        //     new TsconfigPathsPlugin({
        //       configFile: path.resolve(__dirname, 'tsconfig.build.json')
        //     })
        //   ],
        //   alias: {
        //     ...config.resolve.alias,
        //     'flex-design-system-framework/main/all.module.scss': '@flex-design-system/framework',
        //     'flex-design-system-framework/standalone/flexslider.module.scss': '@flex-design-system/framework/flexslider.scss'
        //   }
        // },

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
