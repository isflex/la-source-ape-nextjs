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
