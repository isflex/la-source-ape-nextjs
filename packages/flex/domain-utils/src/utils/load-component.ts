'use client'

/* eslint-disable camelcase */

// import { isServer } from './isServer'
import { fetchFlexCSPNonce } from './get-csp-nonce.js'
import { parseRemoteUrl } from './parse-remote-url.js'
import log from 'loglevel'
import {
  LoadComponent,
  FetchRemote,
  // GetEnv,
  Nonce,
  Window,
} from 'flexiness'

declare let window: Window

const fetchRemote: FetchRemote = (parsedUrl, remoteName, nonce) =>
  new Promise((resolve, reject) => {
    // We define a script tag to use the browser for fetching the remoteEntry.js file
    const script = document.createElement('script')
    script.setAttribute('nonce', nonce)
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('referrerpolicy', 'origin-when-cross-origin')
    script.src = parsedUrl
    script.onerror = (err) => {
      log.error(err)
      reject(new Error(`Failed to fetch remote: ${remoteName}`))
    }
    // When the script is loaded we need to resolve the promise back to Module Federation
    script.onload = () => {
      // The script is now loaded on window using the name defined within the remote
      const proxy = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        get: (request: unknown) => window[remoteName].get(request),
        init: (arg: unknown) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return window[remoteName].init(arg)
          } catch (e) {
            log.error(`Failed to initialize remote: ${remoteName}`)
            reject(e)
          }
        },
      }
      resolve(proxy)
    }
    // Lastly we inject the script tag into the document's head to trigger the script load
    document.head.appendChild(script)
  })

// https://oskari.io/blog/dynamic-remotes-module-federation/
// https://oskari.io/blog/dynamic-remote-container-react/
export const loadComponent: LoadComponent = async ({
  path,
  remoteUrl,
  scope = 'default',
  nonce = '---CSP_NONCE---',
  apiUrl = null,
  gitCommitSHA,
}) => {
  const [remoteName, moduleName] = path.split('/')
  const initRemote = async (nonce: Nonce) => {
    // Check if this remote has already been loaded
    if (!(remoteName in window)) {
      __webpack_nonce__ = nonce
      // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
      await __webpack_init_sharing__(scope)
      // Parse remoteUrl and update webpack publicPath
      const parsedUrl = parseRemoteUrl(remoteUrl, remoteName) // has trailing slash
      // Fetch the remote app. We assume our remote app is exposing a `remoteEntry.js` file.
      await fetchRemote(`${parsedUrl}remoteEntry_${remoteName}_${gitCommitSHA}.js`, remoteName, nonce)
    }

    // 'container' is the remote app
    const container = window[remoteName]

    // //////////////////////////////////////////////////////////////////////////////////////
    // A remote can only be initialized once :
    // https://github.com/webpack/webpack/issues/11033#issuecomment-924199940
    // //////////////////////////////////////////////////////////////////////////////////////

    if (!container.__initialized) {
      container.__initialized = true
      // Initialize the container, it may provide shared modules
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await container.init(__webpack_share_scopes__[scope])
    }

    // The module pass to get() must match the "exposes" item in our remote app exactly
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const factory = await container.get(`./${moduleName}`)
    // 'Module' is the React Component from our remote app's "exposes" configuration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    const Module = factory()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return Module.default || Module
  }

  if (nonce === 'undefined') {
    const _nonce = await fetchFlexCSPNonce(`${apiUrl}`)
    return initRemote(`${_nonce}`)
  } else {
    return initRemote(nonce)
  }

  // Two main case scenarios taken into account to guarantee strict nonce based
  // "Content Security Protocol" functions correctly between different node
  // servers throughtout monorepo project.

  // (1) Gateway host (NextJS - SSR) requires MF (Client-Side) remoteEntry script to be
  // injected into head with mandatory nonce attribute. CSP is enabled in Gateway host
  // HEADERS for script-src at server-side level for every HTTP request
  // [GET /api/nonce Origin] (this script) === [GET /api/nonce Host] (NextJS - SSR)
  // We verify : location.host === apiUrl
  // because Gateway host initiates this load-component script to then fetch /api/nonce

  // (2) MF host (Client-Side) requires MF (Client-Side) remoteEntry script to be
  // injected into head with or without nonce attribute beacuse CSP is not necessarily
  // enabled by default
  // We verify : location.host !== apiUrl
  // All MF's are called by this script on client side level, so we generate a nonce
  // which is stored on globalThis

  // const nonceGeneratedServerSide = location.host === apiUrl

  // if (nonce === 'undefined') {
  //   if (nonceGeneratedServerSide) {
  //     // https://dmitripavlutin.com/javascript-fetch-async-await/
  //     const response = await fetch(`${apiUrl}/api/nonce`);
  //     if (!response.ok) {
  //       const message = `An error has occured: ${response.status}`;
  //       throw new Error(message);
  //     };
  //     const data = await response.json();
  //     setFlexCSPNonce(data.nonce);
  //     return initRemote(data.nonce);
  //   } else {
  //     return initRemote(await generateFlexCSPNonce());
  //   }
  // } else {
  //   return initRemote(nonce);
  // }
}

// export const getEnv: typeof GetEnv = key => {
//   if (typeof window === 'undefined') {
//     // node
//     return process.env[key]
//   }
//   // browser
//   return window.process.env[key]
// }
