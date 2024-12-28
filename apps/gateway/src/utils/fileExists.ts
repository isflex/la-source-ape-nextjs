// import path from 'path'
// import { PathLike, promises as fs } from 'fs'
// import log from 'loglevel'
// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()

// // https://stackoverflow.com/questions/2896626/switch-statement-for-string-matching-in-javascript/2896642
// const test = (str: string, type: 'path') => {
//   switch (str) {
//     // https://stackoverflow.com/questions/5293859/javascript-regexp-only-if-first-character-is-not-an-asterisk
//     case str.match(/^[^/]/)?.input:
//     case str.match(/.+\/$/)?.input:
//       return log.error(`A properly formatted ${type} should have a leading slash, but no trailing slash`)
//     default:
//       break
//   }
// }

// const accessFile = async (path: PathLike) => {
//   try {
//     await fs.access(path)
//     return true
//   } catch {
//     return false
//   }
// }

// export const fileExists = async (file: string, dirPath: string) => {
//   test(dirPath, 'path')
//   const demoFilePath = path.join(serverRuntimeConfig.PROJECT_ROOT, `.${dirPath}/${file}`)
//   return await accessFile(demoFilePath)
// }

export {}
