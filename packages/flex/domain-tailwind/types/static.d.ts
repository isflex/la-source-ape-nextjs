/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */

declare module '*.css'
declare module '*.scss'
declare module '*.svg' {
  // https://github.com/gregberge/svgr/issues/546
  import React from 'react'
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}
declare module '*.bmp' {
  const ref: string
  export default ref
}
declare module '*.gif' {
  const ref: string
  export default ref
}
declare module '*.jpg' {
  const ref: string
  export default ref
}
declare module '*.jpeg' {
  const ref: string
  export default ref
}
declare module '*.png' {
  const ref: string
  export default ref
}
declare module '*.webp' {
  const ref: string
  export default ref
}
declare module '*.ttf' {
  const ref: string
  export default ref
}
