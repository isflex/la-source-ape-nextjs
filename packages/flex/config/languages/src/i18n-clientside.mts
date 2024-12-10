/* eslint-disable max-len */
// import { default as i18nextClientSide } from 'i18next'
// import { initReactI18next } from 'react-i18next'
// import { i18nConfig } from './i18next.config.clientside.mjs'

// /**
//  * Without code-splitting the following imports will be bundled as part of the main.js file.
//     import en from './locales/en.json';
//     import fr from './locales/fr.json';
//     import ja from './locales/ja.json';
//  */

// // const LANG_KEY: string = new URLSearchParams(window?.location?.search).get('language') || 'fr'

// const LANG_KEY: string = 'fr'

// export const init = async () => {
//   const resources = await import(`./locales/${LANG_KEY}/translation.json`)

//   i18nextClientSide
//     .use(initReactI18next)
//     .init({
//       resources: { [LANG_KEY]: resources.default },
//       lng: LANG_KEY,
//       debug: true,
//       fallbackLng: 'en', // use en if detected lng is not available
//       preload: ['en', 'fr'],
//       initImmediate: false,
//       defaultNS: 'translation',
//       ...i18nConfig
//     })
// }

// export { i18nextClientSide }

import { default as i18nextClientSide } from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
// import HttpBackend from 'i18next-http-backend'
// import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { i18nConfig } from './i18next.config.clientside.mjs'
import { initLang } from './i18n-init-lang.js'

// import translationEN from './locales/en/translation.json'
// import translationFR from './locales/fr/translation.json'

// const resources = {
//   en: {
//     translation: translationEN
//   },
//   fr: {
//     translation: translationFR
//   }
// }

// const LANG_KEY: string = 'en'
// const resources = {
//   [LANG_KEY]: {
//     translation: import(`./locales/${LANG_KEY}/translation.json`).then(async(module) => module.default || module)
//   }
// }

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const _initLng = await initLang()

// i18nextClientSide
//   .use(HttpBackend)
//   .use(LanguageDetector)
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init<HttpBackendOptions>({
//     debug: true,
//     // resources,
//     lng: `${_initLng}`,
//     fallbackLng: 'en', // use en if detected lng is not available
//     defaultNS: 'translation',
//     ns: ['translation'],
//     preload: ['en', 'fr'],
//     returnObjects: true,
//     ...i18nConfig
//   })

// https://www.npmjs.com/package/i18next-chained-backend
// https://github.com/i18next/i18next-resources-to-backend#you-can-also-lazy-load-the-in-memory-translations-ie-when-using-webpack

void i18nextClientSide
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(ChainedBackend).init({
    debug: false,
    // resources,
    lng: `${_initLng}`,
    fallbackLng: 'en', // use en if detected lng is not available
    defaultNS: 'translation',
    ns: ['translation'],
    preload: ['en', 'fr'],
    returnObjects: true,
    ...i18nConfig,
    backend: {
      backends: [
        // HttpBackend, // if a namespace can't be loaded via normal http-backend loadPath, then the inMemoryLocalBackend will try to return the correct resources
        // with dynamic import, you have to use the "default" key of the module( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#importing_defaults )
        resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`))
        // resourcesToBackend((language, namespace, callback) => {
        //     import(`./locales/${language}/${namespace}.json`)
        //         .then(({ default: resources }) => {
        //             callback(null, resources)
        //         })
        //         .catch((error) => {
        //             callback(error, null)
        //         })
        // })
      ],
      backendOptions: [{
        // backend: {
        //   crossDomain: true,
        //   loadPath: `${process.env.FLEX_GATEWAY_HOST}/locales/{{lng}}/{{ns}}.json`,
        //   addPath: `${process.env.FLEX_GATEWAY_HOST}/locales/{{lng}}/{{ns}}.missing.json`,
        // },
        // requestOptions: { // used for fetch, can also be a function (payload) => ({ method: 'GET' })
        //   mode: 'cors',
        //   credentials: 'same-origin',
        //   cache: 'default'
        // },
      }]
    }
  })

export { i18nextClientSide }
