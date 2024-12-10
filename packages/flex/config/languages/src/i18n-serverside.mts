/* eslint-disable @typescript-eslint/no-var-requires */

import { default as i18nextServerSide } from 'i18next'
import * as i18nextMiddleware from 'i18next-http-middleware'
// import detector from 'i18next-browser-languagedetector'
// import backend from 'i18next-http-backend'
// import backend from 'i18next-locize-backend'
// import backend from 'i18next-fs-backend'
// import Backend from 'i18next-fs-backend'
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend'
import { initReactI18next } from 'react-i18next'
import { i18nConfig } from './i18next.config.serverside.mjs'

void i18nextServerSide
  // // .use(detector)
  // .use(Backend)
  // .use(initReactI18next) // passes i18n down to react-i18next
  // .use(i18nextMiddleware.LanguageDetector)
  // .init({
  //   debug: false,
  //   fallbackLng: 'en', // use en if detected lng is not available
  //   saveMissing: true, // send not translated keys to endpoint
  //   preload: ['en', 'fr'],
  //   ...i18nConfig
  // })
  .use(FsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init<FsBackendOptions>({
    debug: false,
    // lng: 'en',
    fallbackLng: 'en', // use en if detected lng is not available
    saveMissing: true, // send not translated keys to endpoint
    preload: ['en', 'fr'],
    initImmediate: false,
    defaultNS: 'translation',
    ...i18nConfig
  })

export { i18nextServerSide }
