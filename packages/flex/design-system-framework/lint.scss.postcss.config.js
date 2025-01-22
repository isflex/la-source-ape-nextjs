/* eslint-disable max-len */
// module.exports = {
//   parser: 'postcss-scss',
//   plugins: [
//     require('@abcaustralia/postcss-to-camel-case'),
//     // require('postcss-camelcaser'),
//   ]
// }

module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  syntax: 'postcss-scss',
  plugins: [
    require('@abcaustralia/postcss-to-camel-case')
  ],
});
