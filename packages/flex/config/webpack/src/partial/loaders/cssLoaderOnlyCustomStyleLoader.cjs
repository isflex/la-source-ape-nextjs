const mode = process.env.FLEX_MODE || 'development'

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
              loader: 'style-loader',
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
  }
}
