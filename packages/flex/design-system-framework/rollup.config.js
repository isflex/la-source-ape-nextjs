/* eslint-disable no-unused-vars */

import path from 'path'
import fs from 'fs'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'

export default {
  input: './src/flexiness-ds.scss',
  // output: {
  // 	file: 'dist/flexiness-ds.js',
  // 	format: 'esm'
  // },
  plugins: [
    scss({
      // output: 'dist/flexiness-ds.css',
      output: function (styles, styleNodes) {
        fs.writeFileSync('dist/flexiness-ds.css', styles)
      },
      include: [
        './src/flexiness-ds*.scss',
        './src/assets/svg/*.svg',
        './src/assets/jpg/transparent-noise.png',
        './src/assets/fonts/*.woff*'
      ],
      importer: [
        function importer(url, prev, done) {
          if (url[0] === '~') {
            url = path.resolve(path.join(__dirname, '../../../node_modules/'), url.substr(1));
          }

          return {
            file: url
          };
        }
      ],
      failOnError: false,
      sass: require('sass'),
      processor: () => postcss([
        postcssImport(),
        postcssNested(),
        autoprefixer()
      ]),
      watch: [
        'src/assets',
        'src/base',
        'src/components',
        'src/elements',
        'src/grid',
        'src/layout',
        'src/utilities',
        'src/webfonts'
      ],
      includePaths: [
        'node_modules/',
        path.join(__dirname, '../../../node_modules/'),
        // '../../node_modules/'
      ]
    })
  ]
}
