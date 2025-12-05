import globals from 'globals'

const baseGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.es2022,
  ...globals.commonjs
}

export { baseGlobals }
