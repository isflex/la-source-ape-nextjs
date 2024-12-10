// https://yarnpkg.com/package?name=@rushstack/eslint-patch
// https://www.npmjs.com/package/@rushstack/eslint-patch

require('@rushstack/eslint-patch/modern-module-resolution') // 👈 add this line
require('@rushstack/eslint-patch/custom-config-package-names') // 👈 add this line

module.exports = {
  root: true,
  extends: ['@flexiness/eslint-config-legacy'],
  parserOptions: {
    project: [
      './tsconfig.json',
    ]
  },
}
