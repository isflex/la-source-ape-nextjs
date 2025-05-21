// import { isNodeRuntime } from './is-node-runtime.js'

// async function getGitCommitSHA() {
//   // Identify Node.js only !!
//   // https://stackoverflow.com/a/35813135/10159170
//   if (!isNodeRuntime ) return
//   const subprocess = await import('child_process')
//   const { promisify } = await import('util')
//   const execPromise = promisify(subprocess.exec)
//   if ('CI_COMMIT_SHORT_SHA' in process.env) {
//     return process.env.CI_COMMIT_SHORT_SHA
//   } else if ('GIT_COMMIT_SHORT_SHA' in process.env) {
//     return process.env.GIT_COMMIT_SHORT_SHA
//   } else {
//     const result = await execPromise(`git rev-parse --short HEAD`)
//     const { stdout } = result
//     if (!stdout) return result
//     // console.log(`Git Commit SHA :`, stdout.trim())
//     return stdout.trim()
//   }
// }

// export { getGitCommitSHA }

// /!\ Doesn't seem to work because es6 library exports everything by default at runtime.
// This function targeting a node environment leaks into the browser environment
// when called by client side packages ie amplify auth client.
// Issues arise from the fact that webpack 5 bundler no longer supports node internal
// polyfills in the browser environment
