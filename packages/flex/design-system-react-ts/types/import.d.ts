/* eslint-disable */
// ESM-HMR Interface: `import.meta.hot`

interface ImportMeta {
  // TODO: Import the exact .d.ts files from "esm-hmr"
  // https://github.com/pikapkg/esm-hmr
  hot: any
  env: Record<string, any>
}

declare module '@loadable/component'
declare module 'nanoid/index.browser'

declare module 'i18next' {
  interface TypeOptions {
    returnNull: false;
    allowObjectInHTMLChildren: false;
  }
  export function t<T>(s: string): T;
}
