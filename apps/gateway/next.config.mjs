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
import createMDX from '@next/mdx'
import bundleAnalyzer from '@next/bundle-analyzer'

import { camelCase } from 'lodash-es'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

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
          !folder.startsWith('layout') && folder !== 'api' && folder !== 'actions',
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
    // output: 'standalone', // Disabled - not supported by Amplify Hosting for SSR

    // Enable source maps in production for debugging
    // Set back to false after debugging to reduce build size
    productionBrowserSourceMaps: false,

    trailingSlash: false,
    async rewrites() {
      // Dynamically load active routes and exclude them from rewrite (except web-app)
      const activeRoutes = JSON.parse(fs.readFileSync('./routes.active.json', 'utf8'))
      const excludedRoutes = activeRoutes.filter(route => route !== 'web-app')
      // Always exclude API routes from rewrite
      excludedRoutes.push('api', '_next', 'favicon.ico')
      const exclusionPattern = excludedRoutes.join('|')

      return [
        // Handle root route specifically - server-side rewrite to web-app
        {
          source: '/',
          destination: '/web-app',
        },
        // Handle all other non-excluded routes
        {
          source: `/((?!${exclusionPattern}).*)/:path*`,
          destination: '/web-app/$1/:path*',
        }
      ];
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/web-app',
          permanent: false,
        },
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

    // `serverRuntimeConfig` configuration option will be removed in Next.js 16
    // serverRuntimeConfig: {
    //   PROJECT_ROOT: __dirname,
    //   FLEX_GATEWAY_NAME: process.env.FLEX_GATEWAY_NAME,
    //   FLEX_POKER_CLIENT_NAME: process.env.FLEX_POKER_CLIENT_NAME,
    //   FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST: process.env.FLEX_POKER_CLIENT_DEPLOYED_REMOTE_HOST,
    // },

    transpilePackages: [
      '@types/flexiness',
      // '@flex-design-system/framework',
      '@flex-design-system/react-ts',
      '@flexiness/domain-utils',
      '@flexiness/domain-store'
    ],

    // https://github.com/orgs/marp-team/discussions/499
    // https://gist.github.com/kettanaito/56861aff96e6debc575d522dd03e5725
    serverExternalPackages: [
      '@marp-team/marp-cli',
    ],

    outputFileTracingRoot: process.env.FLEX_PROJ_ROOT,

    typescript: {
      ignoreBuildErrors: false,
      tsconfigPath: './tsconfig.json'
    },

    eslint: {
      ignoreDuringBuilds: true,
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

    // Support MDX files as pages:
    pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],

    webpack: (config, options) => {
      const { isServer, webpack, dev } = options

      // Fix: node:* protocol imports in client bundle
      // CopilotKit's telemetry chain pulls @segment/analytics-node → node-fetch v3
      // which uses node: protocol imports. Strip the prefix so webpack's
      // resolve.fallback (incl. Next.js built-in polyfills) can handle them.
      if (!isServer) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /^node:/,
            (resource) => {
              resource.request = resource.request.replace(/^node:/, '');
            }
          )
        );

        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          worker_threads: false,
          'stream/web': false,
        };
      }

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

      // https://medium.com/@shrestha.sudaman/using-css-modules-with-typescript-a-puzzle-01d62420eb49
      // config.module.rules.forEach((rule) => {
      //   if (rule.oneOf) {
      //     rule.oneOf.forEach((one) => {
      //       if (one.use && Array.isArray(one.use)) {
      //         one.use.forEach((use) => {
      //           if (
      //             typeof use === 'object' &&
      //             use.loader &&
      //             use.loader.includes('css-loader') &&
      //             use.options &&
      //             use.options.modules
      //           ) {
      //             // use.options.modules.exportLocalsConvention = 'camelCase';

      //             use.options = {
      //               ...use.options,
      //               modules: cssLoaderOptions(use.options.modules),
      //             };
      //           }
      //         });
      //       }
      //     });
      //   }
      // });

      const webpackConfig = {
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

      // Only add minimal watchOptions in dev mode for client bundles
      // Let Next.js handle most of the watching, just ensure it's not disabled
      if (dev && !isServer) {
        // webpackConfig.watchOptions = {
        //   ...config.watchOptions,
        //   ignored: ['**/node_modules/**', '**/.next/**'],
        // }
      }

      return webpackConfig
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
.applyPlugin((phase, args, config) => {
  // Uhh.. what's going on here!?
  // throw new Error('Test');

  // enhance the config with the desired plugin and return it back
  return createMDX({
    // Add markdown plugins here, as desired
    // By default only the `.mdx` extension is supported.
    extension: /\.mdx?$/,
    options: {
      /* otherOptions… */
    },
  })(config);
}, '@next/mdx') // Pass an annotation as a last argument
.applyPlugin((phase, args, config) => {
  // Apply bundle analyzer when ANALYZE=true
  return withBundleAnalyzer(config);
}, '@next/bundle-analyzer')
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
