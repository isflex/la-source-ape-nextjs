module.exports = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 150,
  tabWidth: 2,
  trailingComma: 'all',
  quoteProps: 'consistent',
  arrowParens: 'always',
  proseWrap: 'always',
  requireConfig: false,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  editor: {
    formatOnSave: true
  },
  tailwindConfig: './tailwind.config.cjs',
  plugins: [
    require.resolve('prettier-plugin-tailwindcss'),
  ]
}
