// import path from 'path'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'

export default {
  input: './src/flexiness-ds.scss',
  output: { file: './dist/flexiness-ds.js', format: 'esm' },
  plugins: [
    scss({
      fileName: 'flexiness-ds.css',
      include: [
        './src/flexiness-ds*.scss',
        './src/assets/svg/*.svg',
        './src/assets/jpg/transparent-noise.png',
        './src/assets/fonts/*.woff*'
      ],
      // importer: [
      //   function importer(/** @type {string | string[]} */ url, /** @type {any} */ _prev, /** @type {any} */ _done) {
      //     if (url[0] === '~') {
      //       // url = path.resolve(path.join(__dirname, '../../../node_modules/'), url.substr(1));
      //       url = path.resolve(path.join(__dirname, '../../../.yarn/cache/'), url.substr(1));
      //     }

      //     return {
      //       file: url
      //     };
      //   }
      // ],
      failOnError: false,
      sass: require('sass'),
      processor: () => postcss([
        postcssImport(),
        postcssNested(),
        autoprefixer({ overrideBrowserslist: 'Edge 18' })
      ]),
      // outputStyle: 'compressed',
      // watch: [
      //   'src/assets',
      //   'src/base',
      //   'src/components',
      //   'src/elements',
      //   'src/grid',
      //   'src/layout',
      //   'src/utilities',
      //   'src/webfonts'
      // ],
      // includePaths: [
      //   'node_modules/',
      //   path.join(__dirname, '../../node_modules/'),
      //   // '../../node_modules/'
      // ]
    }),
    // postcss({
    //   plugins: [
    //     postcssImport(),
    //     postcssNested(),
    //     autoprefixer()
    //   ]
    // }),
  ]
}