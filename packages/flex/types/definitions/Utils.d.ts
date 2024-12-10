// import Module from "node:module"
// import type { DefaultImportedComponent, LoadableLibrary } from "@loadable/component"
// ////////////////////////////////////////////////////////////////////////
// https://www.typescript-training.com/course/intermediate-v1/07-infer/
export declare type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: any[]): any
}
  ? A
  : never

// ////////////////////////////////////////////////////////////////////////
export type ArrayElement<Type> = Type extends Array<infer Item> ? Item : Type;
// ////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////
// export const GetEnv: (key: string) => string
// ////////////////////////////////////////////////////////////////////////

export type RemoteName = string
export type ModuleName = string
export type RemoteUrl = string
export type Nonce = string
export interface LoadComponentProps {
  path: `${RemoteName}/${ModuleName}`,
  remoteUrl: RemoteUrl,
  scope?: string,
  nonce: Nonce | undefined,
  apiUrl: string,
  gitCommitSHA: string
}

// eslint-disable-next-line no-empty-pattern
export declare type LoadComponent = ({}: LoadComponentProps) => Promise<any>
export declare type FetchRemote = (remoteUrl: RemoteUrl, remoteName: RemoteName, nonce: Nonce) => Promise<any>
export declare type ParseRemoteUrl = (remoteUrl: RemoteUrl, remoteName?: RemoteName) => string
