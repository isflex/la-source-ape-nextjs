import globals from 'globals'

const baseGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.es2021,
  ...globals.commonjs
}

export { baseGlobals }
