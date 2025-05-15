/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import type { ReactElement, ReactNode } from 'react'

import type {
  NextComponentType,
  NextPageContext,
  NextLayoutComponentType,
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps
} from 'next'
import type { AppProps } from 'next/app'

// import { I18next } from 'i18next'
import { UserInterfaceStore, FlexI18next } from 'flexiness'
interface Stores {
  UIStore?: UserInterfaceStore,
}

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
}

// /////////////////////////////////////////////////////////////////////////////////
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern
type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
}

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout
  pageProps: PageAppProps
}
// /////////////////////////////////////////////////////////////////////////////////
// https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5
declare module 'next' {
  type NextLayoutComponentType<P = {}> = NextComponentType<
    NextPageContext,
    any,
    P
  > & {
    getLayout?: (page: ReactNode) => ReactNode
  }
}

declare module 'next/app' {
  type AppLayoutProps<P = {}> = AppProps & {
    Component: NextLayoutComponentType
    pageProps: PageAppProps
  }
}
// /////////////////////////////////////////////////////////////////////////////////

type mf = string

interface LayoutProps {
  children: React.ReactNode
  props: PageAppProps
}

export interface NextRouteOptions {
  shallow?: boolean
}

interface ModFedData {
  gitCommitSHA?: string
}

interface PageStaticData {
  pageName: string
  demoFile?: string
}

interface ServerPageInfo {
  mobileCheck: boolean
}

interface PageAppProps extends PageStaticData, ModFedData {
  error?: Error
  // _i18n?: I18next
  _i18n?: FlexI18next
  _initLng?: FlexI18next['language']
  stores: Stores
  _nonce?: string
  // dehydratedState?: DehydratedState
}

interface LogoProps {
  id?: string
  ref?: React.Ref<HTMLDivElement>
  [x: string]: any
}
