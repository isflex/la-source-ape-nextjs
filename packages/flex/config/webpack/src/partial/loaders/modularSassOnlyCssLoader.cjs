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
                    },
                  } : null),
                ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'named'
                  ? {
                    modules: {
                      namedExport: true,
                      exportLocalsConvention: 'camel-case-only',
                      mode: 'local',
                      localIdentName: '[local]__[hash:base64:5]',
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
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
                importLoaders: 1,
                modules: {
                  mode: 'icss',
                  localIdentName: mode === 'development' ? '[path][name]__[local]' : '[local]__[hash:base64:5]',
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
  }
}
