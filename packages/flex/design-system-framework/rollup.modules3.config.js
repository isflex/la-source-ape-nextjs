// import path from 'path'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'

export default {
  input: './src/modules3/main/all.module.scss',
  output: { file: './dist/modules/allv3.module.js', format: 'esm' },
  plugins: [
    scss({
      fileName: 'allv3.module.css',
      // include: [
      //     './src/modules/default/*.module.scss',
      //     './src/assets/svg/*.svg',
      //     './src/assets/jpg/transparent-noise.png',
      //     './src/assets/fonts/*.woff*'
      // ],
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
      failOnError: true,
      sass: require('sass'),
      processor: () => postcss([
        postcssImport(),
        postcssNested(),
        autoprefixer({ overrideBrowserslist: 'Edge 18' })
      ]),
      // outputStyle: 'compressed',
      // watch: [
      //     'src/assets',
      //     'src/modules/base',
      //     'src/modules/components',
      //     'src/modules/elements',
      //     'src/modules/grid',
      //     'src/utilities',
      //     'src/webfonts'
      // ],
      // includePaths: [
      // 	'node_modules/',
      // 	path.join(__dirname, '../../node_modules/'),
      //     // '../../node_modules/'
      // ]
    }),
  ]
}
