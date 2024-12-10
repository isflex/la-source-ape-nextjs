/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */

import React from 'react'
// import Wepack from 'webpack'
// import jQuery from 'jquery'
import { UserInterfaceStore } from '@flexiness/domain-store'
export { UserInterfaceStore }
import { Nonce } from './Utils'
import { FlexI18next } from './UIStore'
// import type I18next from 'i18next'

declare global {
  var __webpack_init_sharing__: (scope: string) => Promise<void>
  var __webpack_require__: any
  var __webpack_share_scopes__: any
  var __webpack_nonce__: string
  var __BROWSER__: any
  var __BROWSER_GLOBAL__: any

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  // export interface globalThis extends FlexGlobalThis {}
  export interface FlexGlobalThis {}
}

export interface Window {
  // jQuery: typeof jQuery
  // $: typeof jQuery
  __remotes__: Record<string, string>
  __initialized: boolean
  [key: string]: any
}

export type FlexGlobalThis = {
  [scope: string]: any
  __BROWSER__: any
  __BROWSER_GLOBAL__: any
  __webpack_require__: Record<string, string>
  // __webpack_require__: typeof Wepack.RuntimeGlobals
  // React: typeof React
  // Flexiness: keyof globalThis & Flexiness
  Flexiness: Flexiness
}

export interface Flexiness extends FlexGlobalThis {
  domainApp?: {
    // FlexComponents?: typeof import('@flex-design-system/react-ts/client-sync-styled-default')
    // FlexComponents?: typeof import('flex_design_system_react_ts_client')
    // FlexServerComponents?: typeof import('@flex-design-system/react-ts/server-async-styled-default')
    // FlexServerComponents?: typeof import('flex_design_system_react_ts_server')
    UIStore?: UserInterfaceStore
    React?: typeof React
    FlexCSPNonce?: Nonce
    FlexLanguage?: FlexI18next['language']
  }
}
