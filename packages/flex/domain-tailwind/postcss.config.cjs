/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-var-requires */

// import tailwind from 'tailwindcss'
// import autoprefixer from 'autoprefixer'
// import tailwindConfig from './tailwind.config.cjs'

// export default {
//   plugins: [
//     {
//       'postcss-import': {}
//     },
//     {
//       'tailwindcss/nesting': 'postcss-nesting',
//     },
//     tailwind(tailwindConfig),
//     {
//       'postcss-preset-env': {
//         features: { 'nesting-rules': false },
//       },
//     },
//     autoprefixer
//   ],
// }

const path = require('path')

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    'tailwindcss': {
      config: path.join(__dirname, 'tailwind.config.cjs'),
    },
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
    'autoprefixer': {},
  },
}
