import path from 'path'
import postcss from 'rollup-plugin-postcss'
// import scss from 'rollup-plugin-scss'
// import postcss from 'postcss'
// import postcssImport from 'postcss-import'
// import postcssNested from 'postcss-nested'
// import autoprefixer from 'autoprefixer'

export default {
  input: './src/modules3/main/all.module.scss',
  plugins: [
    postcss({
      // extract: true,
      // Or with custom file name
      extract: path.resolve('dist/modules/allv3.module.css'),
      config: {
        path: './postcss.config.js'
      },
    }),
  ]
}
