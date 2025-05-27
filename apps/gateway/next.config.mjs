// __dirname is not defined in ES module scope
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// require.resolve for ES modules
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import fs, { writeFileSync } from 'node:fs'
import subprocess from 'node:child_process'
import { promisify } from 'node:util'
const execPromise = promisify(subprocess.exec)

// import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { Config } from 'next-recompose-plugins'
// import { withSentryConfig } from '@sentry/nextjs'

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

async function getBuildId() {
  const result = await execPromise(`git rev-parse --short HEAD`)
  const { stdout, stderr } = result
  if (stderr) Promise.reject(stderr)
  return Promise.resolve(stdout.trim())
}
_buildId = await getBuildId()

console.log(`Git Commit SHA :`, _gitCommitSHA)
console.log(`Build Id       :`, _buildId)
// console.log('process        :', process.cwd())

// https://github.com/vercel/next.js/discussions/21061
async function getActiveRoutes() {
  const regexFolderName = /\[|\]|\./g;
  const jsonData = JSON.stringify([
    // ...fs
    //   .readdirSync(path.resolve(__dirname, 'src/pages'), { withFileTypes: true })
    //   .filter((file) => file.isDirectory())
    //   .map((folder) => folder.name.replace(regexFolderName, ''))
    //   .filter(
    //     (folder) =>
    //       !folder.startsWith('_') && folder !== 'api',
    //   ),
    ...fs
      .readdirSync(path.resolve(__dirname, 'src/app'), { withFileTypes: true })
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name.replace(regexFolderName, ''))
      .filter(
        (folder) =>
          !folder.startsWith('layout') && folder !== 'api',
      )
  ])

  try {
    writeFileSync('./routes.active.json', jsonData, 'utf8')
  } catch (error) {
    console.log('An error has occurred writing file to disk', error)
  }
}
getActiveRoutes()

const mainConfig = new Config(async (phase, args) => {

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // output: 'standalone',

    productionBrowserSourceMaps: true,

    // https://nextjs.org/docs/pages/api-reference/config/next-config-js/rewrites
    // https://www.giovannibenussi.com/blog/redirects-and-rewrites-on-nextjs
    trailingSlash: true,
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: '/web-app/:path*',
        }
      ];
    },
    async redirects() {
      return [
        {
          source: '/qui-nous-sommes',
          destination: 'https://ecolelasource.org/une-ecole-active/role-des-parents/',
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

    // https://github.com/orgs/marp-team/discussions/499
    // https://gist.github.com/kettanaito/56861aff96e6debc575d522dd03e5725
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
      // You can, for example, get the latest git commit hash here
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

    webpack: (config, options) => {
      const { isServer, webpack } = options

      // config.plugins.push(
      //   new webpack.DefinePlugin({
      //     __SENTRY_DEBUG__: false,
      //     __SENTRY_TRACING__: true,
      //     __RRWEB_EXCLUDE_IFRAME__: true,
      //     __RRWEB_EXCLUDE_SHADOW_DOM__: true,
      //     __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      //   }),
      // )

      // https://www.youtube.com/watch?v=mqcUWfdiXUg
      // https://github.com/vercel/next.js/issues/71638#issuecomment-2464405044
      // https://stackoverflow.com/questions/74038400/convert-css-module-kebab-case-class-names-to-camelcase-in-next-js
      // https://stackoverflow.com/questions/78042657/hash-classnames-nextjs-v14

      const regexEqual = (x, y) =>
        x instanceof RegExp &&
        y instanceof RegExp &&
        x.source === y.source &&
        x.global === y.global &&
        x.ignoreCase === y.ignoreCase &&
        x.multiline === y.multiline;

      // function cssLoaderOptions(modules) {
      //   const { getLocalIdent, ...others } = modules;
      //   return {
      //     ...others,
      //     getLocalIdent: (context, _, exportName, options) => {
      //       // const localIdent = getLocalIdent(context, _, exportName, options);
      //       // return localIdent
      //       const customIdent = `${camelCase(exportName)}__${_gitCommitSHA}`
      //       return customIdent
      //     },
      //     exportLocalsConvention: 'camelCaseOnly',
      //   }
      // }

      function cssLoaderOptions(modules) {
        const { getLocalIdent, ...others } = modules
        return {
          ...others,
          getLocalIdent: (context, _, exportName, options) => {
            // const customIdent = exportName.startsWith('flexi-webfont')
            const webFontRegex = new RegExp(/flexi-webfont/g)
            const customIdent = webFontRegex.test(exportName)
              ? `${exportName}__${_buildId}` : `${camelCase(exportName)}__${_buildId}`
            // const customIdent =`${camelCase(exportName)}__${_buildId}`
            return customIdent
          },
          // exportLocalsConvention: 'asIs',
          // exportLocalsConvention: 'camelCaseOnly',
          exportLocalsConvention: 'camelCase',
        }
      }

      // const oneOf = config.module.rules.find(
      //   (rule) => typeof rule.oneOf === 'object'
      // )
      // if (oneOf) {
      //   const moduleSassRule = oneOf.oneOf.find((rule) =>
      //     regexEqual(rule.test, /\.module\.(scss|sass)$/)
      //   )
      //   // console.log('moduleSassRule', moduleSassRule)
      //   if (moduleSassRule) {
      //     const cssLoader = moduleSassRule.use.find(({ loader }) => {
      //       // console.log('loader', loader)
      //       return loader.includes('webpack/loaders/css-loader')
      //     })
      //     if (cssLoader) {
      //       // console.log('cssLoader', cssLoader)
      //       // console.log('cssLoader options', cssLoader.options)
      //       cssLoader.options = {
      //         ...cssLoader.options,
      //         modules: cssLoaderOptions(cssLoader.options.modules),
      //       }
      //       // console.log('cssLoader options', cssLoader.options)
      //     }
      //   }
      // }

      const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        .oneOf.filter((rule) => Array.isArray(rule.use));

      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader')
            && !moduleLoader.loader?.includes('postcss-loader')
            && moduleLoader.options.modules
          ) {
            moduleLoader.options = {
              ...moduleLoader.options,
              modules: cssLoaderOptions(moduleLoader.options.modules),
            }
          }
        });
      });

      // https://github.com/vercel/next.js/issues/12079
      // Find and remove NextJS css rules.
      // const cssRulesIdx = config.module.rules.findIndex(r => r.oneOf)
      // if (cssRulesIdx === -1) {
      //   throw new Error('Could not find NextJS CSS rule to overwrite.')
      // }
      // config.module.rules.splice(cssRulesIdx, 1)

      return {
        ...config,

        // mode: 'production',

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
          // new NodePolyfillPlugin(),
        ],

        experiments: {
          css: true,
          topLevelAwait: true,
          // outputModule: true,
          layers: true,
        },

        infrastructureLogging: {
          level: 'none',
          // colors: true,
          // level: 'verbose',
          // debug: [/PackFileCache/]
        },
      }
    },

    experimental: {
      // turbo: {
      //   rules: {
      //     '*.svg': {
      //       loaders: ['@svgr/webpack'],
      //       as: '*.js',
      //     },
      //   },
      // },
      // dynamicIO: true,
    },
  }

  return nextConfig
})
.build()

export default mainConfig

// export default withSentryConfig(mainConfig, {
//   org: 'flexiness',
//   project: 'la-source-ape-nextjs',
//   // Only print logs for uploading source maps in CI
//   // Set to `true` to suppress logs
//   silent: !process.env.CI,
//   // Automatically tree-shake Sentry logger statements to reduce bundle size
//   disableLogger: true,

//   // OPTIONAL Readable Stack Traces with Source Maps
//   // Pass the auth token
//   authToken: process.env.SENTRY_AUTH_TOKEN,
//   // Upload a larger set of source maps for prettier stack traces (increases build time)
//   widenClientFileUpload: true,

//   // OPTIONAL Avoid Ad-Blockers with Tunneling
//   // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//   // This can increase your server load as well as your hosting bill.
//   // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-side errors will fail.

//   // tunnelRoute: '/monitoring',

//   // OPTIONAL Capture React Component Names
//   reactComponentAnnotation: {
//     enabled: true,
//   },
// })
