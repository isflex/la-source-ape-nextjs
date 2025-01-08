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
            {
              loader: MiniCssExtractPlugin.loader,
              // options: {
              //   emit: false,
              // },
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
                // importLoaders: 1,
              }
            },
            // 'postcss-loader',
            // require.resolve('postcss-loader'),
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
        linkType: 'text/css',
        runtime: false, // loading mechanism deferred to node express server to allow csp nonce
        // attributes: {
        //   'data-target': 'flex-css',
        // },
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "flex-css-styles",
            type: "css/mini-extract",
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
  }
}
