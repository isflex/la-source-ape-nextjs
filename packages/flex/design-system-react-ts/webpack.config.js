/* eslint-disable @typescript-eslint/no-var-requires */

// System dependencies
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

import webpack from 'webpack'
const { container } = webpack
// const { ModuleFederationPlugin } = container
// const { ModuleFederationPlugin } = require('@module-federation/enhanced')
import { ModuleFederationPlugin } from '@module-federation/enhanced/webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import LoadableWebpackPlugin from '@loadable/webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import WebpackRequireFrom from 'webpack-require-from'
// import { WebpackConfigDumpPlugin } from 'webpack-config-dump-plugin'
import { merge as webpackMerge } from 'webpack-merge'

let _gitCommitSHA = ''
async function getGitCommitSHA() {
  const result = await execPromise(`${process.env.FLEX_PROJ_ROOT}/bin/run-get-git-commit.sh`)
  const { stdout, stderr } = result
  if (stderr) Promise.reject(stderr)
  return Promise.resolve(stdout.trim())
}
_gitCommitSHA = await getGitCommitSHA()
console.log(`Git Commit SHA :`, _gitCommitSHA)

const mode = process.env.FLEX_MODE || 'development'
const prod = mode === 'production'
const watching = process.env.BUILD_RUNNING !== 'true'

// const rootLocation = '../../..'

// const rootLocation = require.main.paths[0].split('node_modules')[0].slice(0, -1)

// const findWorkspaceRoot = require('find-yarn-workspace-root')
// const workspacePath = findWorkspaceRoot(__dirname)
// const rootLocation = path.relative(__dirname, workspacePath)
const rootLocation = process.env.FLEX_PROJ_ROOT
console.log('rootLocation : ', rootLocation)
console.log('host   :', process.env.FLEX_DESIGN_SYS_REACT_TS_HOST)
console.log('port   :', process.env.FLEX_DESIGN_SYS_REACT_TS_PORT)
console.log('mode   :', process.env.FLEX_MODE)
console.log(`env    : FLEX_GATEWAY_MODULE_CSS=${process.env.FLEX_GATEWAY_MODULE_CSS}`)
console.log(`env    : BUILD_RUNNING=${process.env.BUILD_RUNNING}`)
console.log(`env    : DEBUG=${process.env.DEBUG}`)

const depsMonorepo = require(`${rootLocation}/package.json`).dependencies
const deps = require('./package.json').dependencies

const getConfig = async (target) => {
  console.log('target :', target)

  // _gitCommitSHA = await getGitCommitSHA()
  // console.log(`Git Commit SHA :`, _gitCommitSHA)

  const cssLoader = target => require(`@flexiness/webpack/cssLoaderOnlyMiniExtract.cjs`)(target)
  // const modularSass = (target, _gitCommitSHA) => prod
  //   ? require(`@flexiness/webpack/modularSassOnlyMiniExtract.cjs`)(target, _gitCommitSHA)
  //   : require(`@flexiness/webpack/modularSassOnlyStyleLoaderDev.cjs`)(target, _gitCommitSHA)
  // const modularSass = (target, _gitCommitSHA) => require(`@flexiness/webpack/modularSassOnlyStyleLoaderDev.cjs`)(target, _gitCommitSHA)
  // const modularSass = (target, _gitCommitSHA) => require(`@flexiness/webpack/modularSassOnlyCssLoader.cjs`)(target, _gitCommitSHA)
  // const modularSass = (target, _gitCommitSHA) => require(`@flexiness/webpack/modularSassOnlyMiniExtract.cjs`)(target, _gitCommitSHA)
  const modularSass = (target, _gitCommitSHA) => require(`@flexiness/webpack/modularSassOnlyMiniExtractIgnoreUrls.cjs`)(target, _gitCommitSHA)

  return webpackMerge(

    {
      experiments: {
        // asyncWebAssembly: true,
        // buildHttp: true,
        // lazyCompilation: true,
        // syncWebAssembly: true,

        css: true,
        topLevelAwait: true,
        // outputModule: true,
        layers: true
      },

      // entry: ['regenerator-runtime/runtime.js', path.resolve(__dirname, 'src/views/index')],
      entry: {
        [`mainEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${_gitCommitSHA}`]: [
          // require.resolve('regenerator-runtime/runtime.js'),
          path.resolve(__dirname, 'src/views/index')
        ],
      },

      context: __dirname, // to automatically find tsconfig.json

      // ...(target === 'web'
      //   ? {
      //     devServer: {
      //       static: {
      //         directory: path.join(__dirname, 'public'),
      //       },
      //       headers: {
      //         'Access-Control-Allow-Origin': '*',
      //         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      //         'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      //       },
      //       open: false,
      //       compress: true,
      //       port: new Number(process.env.FLEX_DESIGN_SYS_REACT_TS_PORT),
      //     },
      //   } : null
      // ),

      // mode: 'development',
      mode: mode,

      target: target === 'web' ? 'browserslist:last 1 chrome version' : 'async-node',
      // target: target === 'web' ? 'browserslist:last 1 chrome version' : 'node20.15',
      // target: target === 'web' ? 'browserslist:last 1 chrome version' : 'es2022',
      // target: 'es5',

      output: {
        path: path.resolve(__dirname, 'build', 'webpack', target),
        // publicPath: 'auto',
        publicPath: `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOST}/${target}/`,
        // publicPath: `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOST}/`,
        // publicPath: `/${process.env.FLEX_POKER_CLIENT_PROXY_PATHNAME}/`,
        crossOriginLoading: 'anonymous',
        clean: true,
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
      },

      optimization: {
        // // default production
        // moduleIds: 'deterministic',
        // chunkIds: 'deterministic',
        // default development
        // moduleIds: 'named',
        // chunkIds: 'named',
        /*
          https://github.com/waldronmatt/dynamic-host-module-federation/blob/main/webpack.common.js

          disable webpack base config `runtimeChunck: single`
          https://github.com/webpack/webpack/issues/11691

          This can be removed when #11843 is merged
          https://github.com/webpack/webpack/pull/11843
        */
        runtimeChunk: false,

        ...(mode === 'production' ? {
          // splitChunks: {
          //   cacheGroups: {
          //     vendor: {
          //       test: /[\\/]node_modules[\\/](react-dom|mobx|reactstrap|lodash)[\\/]/,
          //       name: 'vendors',
          //       chunks: 'all',
          //     },
          //   },
          // },
          // https://stackoverflow.com/questions/48985780/webpack-4-create-vendor-chunk
          // splitChunks: {
          //   chunks: 'all',
          //   maxInitialRequests: Infinity,
          //   minSize: 0,
          //   cacheGroups: {
          //     vendorReact: {
          //       test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          //       name: 'vendor-react'
          //     },
          //     vendorStore: {
          //       test: /[\\/]node_modules[\\/](mobx|mobx-react-lite)[\\/]/,
          //       name: 'vendor-store'
          //     },
          //     vendorUtility: {
          //       test: /[\\/]node_modules[\\/](lodash|moment|moment-timezone)[\\/]/,
          //       name: 'vendor-utility'
          //     },
          //     vendorBootstrap: {
          //       test: /[\\/]node_modules[\\/](react-bootstrap|reactstrap)[\\/]/,
          //       name: 'vendor-bootstrap'
          //     },
          //     vendor: {
          //       test: /[\\/]node_modules[\\/](!react)(!react-dom)(!react-router)(!react-router-dom)(!mobx)(!mobx-react-lite)(!lodash)(!moment)(!moment-timezone)(!react-bootstrap)(!reactstrap)[\\/]/,
          //       name: 'vendor'
          //     },
          //   },
          // },
          /*
            https://github.com/waldronmatt/dynamic-host-module-federation/blob/main/webpack.prod.js

            SplitChunks finds modules which are shared between chunks and splits them
            into separate chunks to reduce duplication or separate vendor modules from application modules.
          */
          // splitChunks: {
          //   /*
          //     cacheGroups tells SplitChunksPlugin to create chunks based on some conditions
          //   */
          //   cacheGroups: {
          //     // vendor chunk
          //     vendor: {
          //       // name of the chunk - make sure name is unqiue to avoid namespace collisions with federated remotes
          //       name: `Vendors_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`,
          //       /*
          //         we need to async this chunck because EVERYTHING is dynamically imported
          //         due to how Module Federation works
          //       */
          //       chunks: 'async',
          //       // import file path containing node_modules
          //       test: /node_modules/,
          //       /*
          //         The higher priority will determine where a module is placed
          //         if it meets multiple conditions (both a shared and npm (vendor) module
          //         Prioritize vendor chuncks over commons
          //       */
          //       priority: 20,
          //     },
          //     common: {
          //       // create a commons chunk, which includes all code shared between entry points
          //       name: `Common_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`,
          //       // minimum number of chunks that must share a module before splitting
          //       minChunks: 2,
          //       // async + async chunks
          //       chunks: 'async',
          //       // lower priority than vendors
          //       priority: 10,
          //       /*
          //         If the current chunk contains modules already split out from the main bundle,
          //         it will be reused instead of a new one being generated.
          //       */
          //       reuseExistingChunk: true,
          //       /*
          //         Enforce value is set to true to force SplitChunksPlugin to
          //         form this chunk irrespective of the size of the chunk
          //       */
          //       enforce: true,
          //     },
          //   },
          // },
        } : {}),
      },

      // https://webpack.js.org/configuration/cache/#gitlab-cicd
      // cache: {
      //   type: 'filesystem',
      // },
      // https://github.com/webpack/webpack/issues/16163

      // cache: prod ? {
      //   type: 'filesystem',
      //   maxMemoryGenerations: 5,
      //   cacheDirectory: path.resolve(__dirname, '.yarn/.cache/webpack'),
      //   buildDependencies: {
      //     config: [
      //       path.join(__dirname, 'package.json')
      //     ]
      //   }
      // } : {
      //   type: 'memory',
      //   maxGenerations: 5
      // },

      cache: {
        type: 'filesystem',
        // defaults to 10 in development mode and to Infinity in production mode.
        // maxMemoryGenerations: 5,
        cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
        buildDependencies: {
          config: [
            path.join(__dirname, 'package.json')
          ]
        }
      },

      resolve: {
        extensions: ['.tsx', '.ts', '.mts', '.jsx', '.js', '.mjs', '.ttf', '.scss'],
        // Add support for TypeScripts fully qualified ESM imports.
        extensionAlias: {
          '.js': ['.js', '.ts', '.tsx'],
          '.cjs': ['.cjs', '.cts'],
          '.mjs': ['.mjs', '.mts']
        },
        plugins: [
          new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, 'tsconfig.build.json'),
          })
        ],

        ...(target === 'web' &&
          {
            fallback: {
              'buffer': require.resolve('buffer'),
              'crypto': require.resolve('crypto-browserify'),
              'stream': require.resolve('stream-browserify'),
              // 'process': require.resolve('process/browser'),
            },
          }
        ),

        alias: {
          // /!\ Aliases are now defined by typescript paths thru TsconfigPathsPlugin
          // react: path.resolve(`${rootLocation}/node_modules/react`),
          // history: path.resolve(`${rootLocation}/node_modules/history`),
          // 'react-dom': path.resolve(`${rootLocation}/node_modules/react-dom`),
          // 'react-helmet': path.resolve(`${rootLocation}/node_modules/react-helmet`),
          // 'react-router-dom': path.resolve(`${rootLocation}/node_modules/react-router-dom`),
          // lodash: path.resolve(`${rootLocation}/node_modules/lodash`),
        }
      },

      // devtool: !prod ? 'cheap-module-source-map': false,
      devtool: !prod ? 'inline-source-map': false,
      // devtool: !prod ? 'eval-source-map': false,
      watch: watching,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
      },

      module: {
        rules: [
          {
            test: /\.(tsx|ts|jsx|js)?$/,
            loader: require.resolve('ts-loader'),
            exclude: /node_modules/,
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              projectReferences: true,
              transpileOnly: true
            },
          },

          // ///////////////////////////////////////////////////////

          // Load font files and images
          {
            test: /\.(woff|woff2|ttf|eot|svg|jpg|jpeg|png|gif)(\?[\s\S]+)?$/,
            use: [
              {
                loader: require.resolve('file-loader'),
                options: {
                  esModule: true
                }
              }
            ]
          },
        ],
      },

      plugins: [
        // new ModuleFederationPlugin({
        //   // name: 'flex_design_system_react_ts_modfed',
        //   name: `${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`,
        //   // filename: 'remoteEntry.js',
        //   filename: `remoteEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${_gitCommitSHA}.js`,
        //   // remotes: {
        //   //   [`${process.env.ACO_MF_NAME}`]: `${process.env.ACO_MF_NAME}@${process.env.ACO_PROTOCOL}${process.env.ACO_HOSTNAME}:${process.env.ACO_PORT}/remoteEntry.js`
        //   // },
        //   remotes: {},
        //   exposes: {
        //     './Styled':  './src/styled-default',
        //     './StyledAsync':  './src/server-async-styled-default',
        //     './ModulesDefault': './src/views/ModulesDefault',
        //   },
        //   shared: {
        //     ...deps,
        //     ...depsMonorepo,
        //     // react: {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['react'],
        //     //   // eager: true,
        //     // },
        //     // 'react-dom': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['react-dom'],
        //     // },
        //     // 'react-router-dom': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['react-router-dom'],
        //     // },
        //     // history: {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['history'],
        //     //   // eager: true,
        //     // },
        //     // '@emotion/react': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['@emotion/react'],
        //     //   eager: true,
        //     // },
        //     // 'react-awesome-reveal': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['react-awesome-reveal'],
        //     //   eager: true,
        //     // },
        //     // 'prop-types': {
        //     //   // singleton: true,
        //     //   // requiredVersion: depsMonorepo['prop-types'],
        //     //   eager: true,
        //     // },
        //     // lodash: {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['lodash'],
        //     //   eager: true,
        //     // },
        //     // mobx: {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['mobx'],
        //     // },
        //     // 'mobx-react-lite': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['mobx-react-lite'],
        //     // },
        //     // '@loadable/component': {
        //     //   singleton: true,
        //     //   requiredVersion: depsMonorepo['@loadable/component'],
        //     // },
        //     // '@flexiness/domain-lib-mobx-react-router': {
        //     //   import: '@flexiness/domain-lib-mobx-react-router',
        //     //   requiredVersion: require('@flexiness/domain-lib-mobx-react-router').version,
        //     //   shareKey: '@flexiness/domain-lib-mobx-react-router', // under this name the shared module will be placed in the share scope
        //     //   shareScope: 'default', // share scope with this name will be used
        //     //   singleton: true, // only a single version of the shared module is allowed
        //     // },
        //     '@flex-design-system/framework': {
        //       import: '@flex-design-system/framework',
        //       requiredVersion: require('@flex-design-system/framework/package.json').version,
        //       shareKey: '@flex-design-system/framework', // under this name the shared module will be placed in the share scope
        //       shareScope: 'default', // share scope with this name will be used
        //       singleton: true, // only a single version of the shared module is allowed
        //     },
        //   },
        //   ...(target === 'node' &&
        //     {
        //       runtimePlugins: [
        //         require.resolve('@module-federation/node/runtimePlugin')
        //       ],
        //       remoteType: 'script',
        //       library: { type: 'commonjs-module', name: `${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`, }
        //     }
        //   ),
        // }),

        ...(process.env.BUILD_RUNNING !== 'true'
          ? [
            new ForkTsCheckerWebpackPlugin({
              typescript: {
                memoryLimit: 2048,
                mode: 'readonly',
                configFile: path.resolve(__dirname, 'tsconfig.json'),

                // memoryLimit: 4096,
                // build: true,
                // mode: 'write-references',
                // configFile: path.resolve(__dirname, 'tsconfig.json'),
              }
            })
          ]
          : []
        ),

        // ...(!prod
        //   ? [
        //     // https://github.com/mrsteele/dotenv-webpack/issues/70#issuecomment-942441074
        //     new Dotenv({
        //       path: `${process.env.FLEX_PROJ_ROOT}/env/public/.env.${process.env.FLEX_MODE}`,
        //       systemvars: true,
        //       expand: true
        //     }),
        //   ]
        //   : []
        // ),

        new Dotenv({
          path: `${process.env.FLEX_PROJ_ROOT}/env/public/.env.${process.env.FLEX_MODE}`,
          systemvars: true,
          expand: true
        }),

        // new webpack.DefinePlugin({
        //   // // @ts-expect-error
        //   // __GIT_BRANCH__: childProcess.execSync('git rev-parse --abbrev-ref HEAD'),
        //   // // @ts-expect-error
        //   // __GIT_COMMIT__: childProcess.execSync('git rev-parse HEAD'),
        //   // ensure the NODE_ENV targets production, making react optimized for production
        //   // with lesser checks and assertions
        //   // as per https://reactjs.org/docs/optimizing-performance.html#webpack
        //   // 'process.env.NODE_ENV': JSON.stringify('production'),
        //   'process.env': JSON.stringify(process.env)
        // }),

        // new HtmlWebpackPlugin({
        //   template: './public/index.html',
        // }),

        new HtmlWebpackPlugin({
          inject: false,
          template: `./public/index.html`,
          // https://github.com/module-federation/module-federation-examples/issues/102
          publicPath: '/',
          filename: `index.ejs`,
          chunks: [`mainEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${_gitCommitSHA}`]
        }),

        new CopyWebpackPlugin({
          patterns: [
            { from: 'public/logo/favicon-128.ico', to: './logo/favicon-128.ico' },
            { from: 'public/logo/Logo_192.png', to: './logo/Logo_192.png' },
            { from: 'public/logo/Logo_512.png', to: './logo/Logo_512.png' },
            { from: 'public/logo/flexiness/logo_flexiness_2.svg', to: './logo/flexiness/logo_flexiness_2.svg' },
          ],
        }),

        new LoadableWebpackPlugin(),
        new WebpackManifestPlugin({}),
        new AssetsPlugin({
          filename: 'assets.json',
          entrypoints: true,
          includeFilesWithoutChunk: true
        }),
        ...(target === 'web'
          ? [
            // Work around for Buffer is undefined:
            // https://github.com/webpack/changelog-v5/issues/10
            new webpack.ProvidePlugin({
              Buffer: ['buffer', 'Buffer'],
            }),
            new webpack.ProvidePlugin({
              // process: 'process/browser',
              process: [require.resolve('process/browser')]
            }),
          ]
          : []
        ),
        new NodePolyfillPlugin(),
        new WebpackRequireFrom({
          variableName: `${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_url`,
          suppressErrors: true
        }),
        // new WebpackConfigDumpPlugin()
      ],
    },

    // Css Loaders
    // cssLoader({ target }),
    // Modular Sass loaders
    modularSass(target, _gitCommitSHA),
  )
}

export default [
  getConfig('web'),
  // getConfig('node')
]
