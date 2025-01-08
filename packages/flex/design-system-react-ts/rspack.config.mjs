// https://github.com/web-infra-dev/rspack-repro/blob/main/config.mjs
// https://dev.to/woovi/bundling-many-frontends-with-a-single-rspack-config-5394

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

import rspack from '@rspack/core'
// const { ModuleFederationPlugin } = require('@module-federation/enhanced-rspack')
// const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack')
const { DotenvPlugin } = require('rspack-plugin-dotenv')
const { CssExtractRspackPlugin } = require('@rspack/core')
// const ReactRefreshPlugin = require('@rspack/plugin-react-refresh')

// import AssetsPlugin from 'assets-webpack-plugin'
import LoadableWebpackPlugin from '@loadable/webpack-plugin'
// import CopyWebpackPlugin from 'copy-webpack-plugin'
// import Dotenv from 'dotenv-webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
// import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
// import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
// import WebpackRequireFrom from 'webpack-require-from'

const { WebpackManifestPlugin: RspackManifestPlugin } = await import('rspack-manifest-plugin')

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


// eslint-disable-next-line @typescript-eslint/no-var-requires
const depsMonorepo = require(`${rootLocation}/package.json`).dependencies
// eslint-disable-next-line @typescript-eslint/no-var-requires
const deps = require('./package.json').dependencies

// // https://stackoverflow.com/questions/76700259/how-do-i-replace-a-deprecated-null-loader-regex-test-with-webpack-5s-resolve-al
// // import { globSync } from 'glob'
// const glob = require('glob')
// const ignoreScssAssets = glob.globSync('**/*.scss', { absolute: true });
// const ignoreScssModules = ignoreScssAssets.reduce((acc, cur) => {
//     acc[cur] = false;
//     return acc;
// }, {});
// console.log('ignoreModules: ', ignoreScssModules);

const getConfig = async (env, argv) => {
  console.log('target :', target)
  const { target } = argv
  /**
   * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
   */
  const config = {
    mode: env,

    experiments: {
      css: true,
      topLevelAwait: true,
      // outputModule: true,
      // layers: true, // not recognized by rspack
      // rspackFuture: {
      //   // disableTransformByDefault: true, // not recognized by rspack WTF ??
      //   // newResolver: true,
      //   // newTreeshaking: true
      // }
    },

    entry: {
      [`mainEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${_gitCommitSHA}`]: [
        // require.resolve('regenerator-runtime/runtime.js'),
        path.resolve(__dirname, 'src/views/index')
      ],
    },

    context: __dirname,

    // devServer: {
    //   static: {
    //     directory: path.join(__dirname, 'dist'),
    //   },
    //   port: 4009,
    // },

    target: target,

    output: {
      path: path.resolve(__dirname, 'build', 'rspack', target),
      // publicPath: 'auto',
      publicPath: `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOST}/${target}/`,
      // publicPath: `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOST}/`,
      // publicPath: `/${process.env.FLEX_POKER_CLIENT_PROXY_PATHNAME}/`,
      crossOriginLoading: 'anonymous',
      clean: true,
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
    },

    resolve: {
      extensions: ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.mts', '.cts', '.tsx', '.ttf', '.scss'],
      // Add support for TypeScripts fully qualified ESM imports.
      extensionAlias: {
        '.js': ['.js', '.jsx', '.ts', '.tsx'],
        '.mjs': ['.mjs', '.mts'],
        '.cjs': ['.cjs', '.cts']
      },
      tsConfigPath: path.resolve(__dirname, 'tsconfig.build.json'),

      alias: {
        // ...ignoreScssModules,
        'flex-design-system-framework/main/all.module.scss': '@flex-design-system/framework',
        'flex-design-system-framework/standalone/flexslider.module.scss': '@flex-design-system/framework/flexslider.scss'
      },

      // fullySpecified: true, // OMG WTF !!

      // fallback: {
      //   ...(target === 'web' &&
      //   {
      //     // See packages/flex/domain-utils/src/utils/git-commit-sha.ts
      //     // 'child_process': false,
      //     // 'node:util': false,
      //     // 'node:path': false,
      //     // 'node:url': false,

      //     // 'url': require.resolve('url'),
      //     // 'fs': require.resolve('browserify-fs'),
      //     // 'buffer': require.resolve('buffer'),
      //     // 'crypto': require.resolve('crypto-browserify'),
      //     // 'stream': require.resolve('stream-browserify'),
      //     crypto: false,
      //   }),
      // },
    },

    // devtool: !prod ? 'cheap-module-source-map': false,
    devtool: !prod ? 'inline-source-map': false,
    // devtool: !prod ? 'eval-source-map': false,
    watch: process.env.BUILD_RUNNING !== 'true' ?? false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
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

      // new HtmlWebpackPlugin({
      //   template: `./public/index.html`,
      // }),

      new HtmlWebpackPlugin({
        inject: false,
        template: `./public/index.html`,
        // https://github.com/module-federation/module-federation-examples/issues/102
        publicPath: '/',
        filename: `index.ejs`,
        chunks: [`mainEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}_${_gitCommitSHA}`]
      }),

      new rspack.CopyRspackPlugin({
        patterns: [
          { from: 'public/logo/flexiness/favicon-128.ico', to: './logo/flexiness/favicon-128.ico' },
          { from: 'public/logo/flexiness/Logo_192.png', to: './logo/flexiness/Logo_192.png' },
          { from: 'public/logo/flexiness/Logo_512.png', to: './logo/flexiness/Logo_512.png' },
          { from: 'public/logo/flexiness/logo_flexiness_2.svg', to: './logo/flexiness/logo_flexiness_2.svg' },
        ],
      }),

      // // https://github.com/web-infra-dev/rspack-compat/blob/main/packages/rspack-manifest-plugin%405/rspack.config.js
      new RspackManifestPlugin({
        fileName: 'manifest.json',
        generate: (seed, files, entries) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = Object.keys(entries).reduce(
            (previous, name) =>
            previous.concat(
              entries[name].filter(fileName => !fileName.endsWith('.map'))
            ),
            []
          );
          return {
            files: manifestFiles,
            entrypoints: entrypointFiles
          };
        }
      }),

      ...(target === 'web'
        ? [
          // new NodePolyfillPlugin(), // Seriously, pnpm ?
          // new NodePolyfillPlugin({
          //   includeAliases: ['crypto']
          // }),

          new rspack.ProvidePlugin({
            // 'React': [require.resolve('react')],
            Buffer: ['buffer', 'Buffer'],
            process: [require.resolve('process/browser')],
          }),

        ] : []
      ),

      ...(target === 'node'
        ? [
          new rspack.node.NodeTargetPlugin()
        ] : []
      ),

      ...(target === 'extractCss'
        ? [
          new CssExtractRspackPlugin(),
        ] : []
      ),

      new LoadableWebpackPlugin(),

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
      //     new DotenvPlugin({
      //       path: `${process.env.FLEX_PROJ_ROOT}/env/public/.env.${process.env.FLEX_MODE}`,
      //       systemvars: true
      //     }),
      //   ]
      //   : []
      // ),

      new DotenvPlugin({
        path: `${process.env.FLEX_PROJ_ROOT}/env/public/.env.${process.env.FLEX_MODE}`,
        systemvars: true
      }),

    ].filter(Boolean),

    module: {
      // parser: {
      //   'css/module': {
      //     namedExports: false,
      //   }
      // },

      // generator: {
      //   'css/module': {
      //     exportsConvention: 'camel-case-only',
      //     exportsOnly: false,
      //     localIdentName: `[name]_[local]__${_gitCommitSHA}`,
      //     esModule: true,
      //   },
      // },

      rules: [
        {
          test: /\.ts(x)?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'builtin:swc-loader',
              /**
               * @type {import('@rspack/core').SwcLoaderOptions}
               */
              options: {
                sourceMap: !prod,
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      // development: !prod,
                      // refresh: !prod,

                      // pragma: 'React.createElement',
                      // pragmaFrag: 'React.Fragment',
                      // throwIfNamespace: true,
                      // development: false,
                      // useBuiltins: false,
                    },
                  },
                },
                env: {
                  targets: 'Chrome >= 48', // browser compatibility
                },
              },
            },
          ],
        },
        {
          test: /\.js(x)?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                sourceMap: !prod,
                jsc: {
                  parser: {
                    syntax: 'ecmascript',
                    jsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      // development: !prod,
                      // refresh: !prod,

                      // pragma: 'React.createElement',
                      // pragmaFrag: 'React.Fragment',
                      // throwIfNamespace: true,
                      // development: false,
                      // useBuiltins: false,
                    },
                  },
                },
                env: {
                  targets: 'Chrome >= 48', // browser compatibility
                },
              },
            },
          ],
        },

        {
          // type: 'css/module',
          type: 'javascript/auto',
          test: /\.module\.s(a|c)ss$/i,
          use: [
            {
              loader: require.resolve('style-loader'),
              // options: {
              //   insert: require.resolve('@flexiness/domain-utils/style-loader-esm'),
              // },
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: !prod,
                importLoaders: 1,
                modules: {
                  namedExport: false,
                  exportLocalsConvention: 'camel-case-only',
                  mode: 'local',
                  localIdentName: `[local]__${_gitCommitSHA}`,
                  exportOnlyLocals: false,
                }
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require.resolve('sass'),
                sourceMap: !prod,
                api: 'modern-compiler',
                sassOptions: {
                  // style: `compressed`,
                  silenceDeprecations: ['legacy-js-api'],
                },
              },
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
        },

        {
          test: /\.svg$/i,
          type: 'asset/inline',
        },

        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf|)$/,
          type: 'asset/resource',
        },

        {
          test: /^BUILD_ID$/,
          type: 'asset/source',
        },
      ],
    },

    ...(target === 'extractCss' &&
      {
        optimization: {
          splitChunks: {
            cacheGroups: {
              styles: {
                name: 'flex-framework-styles',
                type: 'css/rspack-css-extract',
                chunks: 'all',
                enforce: true,
              },
            },
          },
        },
      }
    ),
  }

  const rulesExtractCss = [
    {
      test: /\.css$/,
      // /!\ Do nothing here, this is handled by experiments css
    },
    {
      type: 'javascript/auto',
      test: /\.module\.s(a|c)ss$/i,
      use: [
        CssExtractRspackPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            esModule: true,
            sourceMap: !prod,
            importLoaders: 1,
            ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'default'
              ? {
                modules: {
                  namedExport: false,
                  exportLocalsConvention: 'camel-case-only',
                  mode: 'local',
                  localIdentName: `[name]_[local]__${_gitCommitSHA}`,
                  exportOnlyLocals: false,
                },
              } : null),
            ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'named'
              ? {
                modules: {
                  namedExport: true,
                  exportLocalsConvention: 'camel-case-only',
                  mode: 'local',
                  localIdentName: `[name]_[local]__${_gitCommitSHA}`,
                  exportOnlyLocals: true,
                }
              } : null),
          },
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: 'sass',
            sourceMap: !prod,
            api: 'modern-compiler',
            sassOptions: {
              // style: `compressed`,
              silenceDeprecations: ['legacy-js-api'],
            },
          },
        },
      ],
    },
    {
      type: 'javascript/auto',
      test: /\.s[ac]ss$/i,
      exclude: /\.module.(s(a|c)ss)$/,
      use: [
        CssExtractRspackPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            esModule: true,
            sourceMap: !prod,
            importLoaders: 1,
          }
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: 'sass',
            sourceMap: !prod,
            api: 'modern-compiler',
            sassOptions: {
              // style: `compressed`,
              silenceDeprecations: ['legacy-js-api'],
            },
          },
        },
      ],
    },
  ]
  if (target === 'extractCss') config.module.rules.push(...rulesExtractCss)
  return config
}

export default [
  getConfig(mode, { target: 'web'}),
  getConfig(mode, { target: 'node' }),
  // getConfig(mode, { target: 'extractCss' })
]
