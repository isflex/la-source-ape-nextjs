export as namespace FlexMobxReactRouter
import * as H from 'history'
// import * as MobX from 'mobx'
// import * as MobXLite from 'mobx-react-lite'
import { Route as UniversalRoute } from 'universal-router'
export { Route as UniversalRoute, RouteResult } from 'universal-router'
export declare type HostnameFrontend = string | undefined
export declare type IdFrontend = string
export declare type BasenameFrontend = string
export declare type StatusFrontend = 'loading' | 'unloading' | 'done' | 'error' | null
export declare interface BundleJSProps {
  path: string
  id?: string
}

export declare type MicroFronts = Map<IdFrontend, MicroFront>

export interface MicroFront {
  microId: IdFrontend,
  port: string | null,
  key: string,
  pathname: string,
  status: StatusFrontend
  basename: BasenameFrontend
  bundleJSPending: BundleJSProps[],
  microRoutes: UniversalRoute[]
}

export interface RouterProps {
  children?: React.ReactNode
  history?: H.History
}

export interface UseRouterProps {
  path: string,
}

