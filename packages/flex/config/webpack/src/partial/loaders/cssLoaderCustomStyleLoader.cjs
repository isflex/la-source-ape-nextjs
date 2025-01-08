const mode = process.env.FLEX_MODE || 'development'
const prod = mode === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (target) => {
  // console.log('cssLoader target', target)
  return {
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.css$/i,
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
                  insert: require.resolve('@flexiness/domain-utils/style-loader-esm'),
                },
              },
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
              }
            },
          ]
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
              'data-target': 'flex-css',
            },
          })
        ] : []
      ),
    ]
  }
}
