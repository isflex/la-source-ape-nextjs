/* eslint-disable @typescript-eslint/no-var-requires */
const mode = process.env.FLEX_MODE || 'development'
const prod = mode === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (target) => {
  // console.log('modularSass target', target)
  return {
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.module\.s(a|c)ss$/i,
          use: [
            target === 'node'
              ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  emit: false,
                },
              } : {
                loader: require.resolve('style-loader'),
                options: {
                  attributes: {
                    'data-target': 'flex-scss',
                  },
                },
              },
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
                importLoaders: 1,
                ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'default'
                  ? {
                    modules: {
                      namedExport: false,
                      exportLocalsConvention: 'camel-case-only',
                      mode: 'local',
                      // localIdentName: mode === 'development' ? '[path][name]__[local]' : '[local]__[hash:base64:5]',
                      localIdentName: '[local]__[hash:base64:5]',
                      exportOnlyLocals: target === 'node',
                    },
                  } : null),
                ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'named'
                  ? {
                    modules: {
                      namedExport: true,
                      exportLocalsConvention: 'camel-case-only',
                      mode: 'local',
                      localIdentName: '[local]__[hash:base64:5]',
                      exportOnlyLocals: target === 'node',
                    }
                  } : null),
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require('sass'),
                sourceMap: mode === 'development'
              },
            },
          ],
        },
        {
          type: 'javascript/auto',
          test: /\.s[ac]ss$/i,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            target === 'node'
              ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  emit: false,
                },
              } : {
                loader: require.resolve('style-loader'),
                options: {
                  attributes: {
                    'data-target': 'flex-scss',
                  },
                },
              },
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
                importLoaders: 1,
                modules: {
                  mode: 'icss',
                  localIdentName: mode === 'development' ? '[path][name]__[local]' : '[local]__[hash:base64:5]',
                  exportOnlyLocals: target === 'node',
                }
              }
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require('sass'),
                sourceMap: mode === 'development'
              },
            },
          ],
        },
      ]
    },
    plugins: [
      ...(target === 'node'
        ? [
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
            linkType: 'text/css',
            runtime: false,
            // runtime: false, // loading mechanism in production deferred to node express server to allow csp nonce
            attributes: {
              'data-target': 'flex-scss',
            },
          })
        ] : []
      ),
    ]
  }
}
