/* eslint-disable @typescript-eslint/no-var-requires */
const mode = process.env.FLEX_MODE || 'development'
const prod = mode === 'production'

module.exports = (target, _gitCommitSHA) => {
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
                      localIdentName: `[local]__${_gitCommitSHA}`,
                      exportOnlyLocals: false,
                    },
                  } : null),
                ...(process.env.FLEX_GATEWAY_MODULE_CSS === 'named'
                  ? {
                    modules: {
                      namedExport: true,
                      exportLocalsConvention: 'camel-case-only',
                      mode: 'local',
                      localIdentName: `[local]__${_gitCommitSHA}`,
                      exportOnlyLocals: true,
                    }
                  } : null),
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require.resolve('sass'),
                sourceMap: mode === 'development',
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
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                sourceMap: mode === 'development',
                importLoaders: 1,
              }
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require.resolve('sass'),
                sourceMap: mode === 'development',
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
    },
  }
}
