import {
  locales,
  // defaultLocale
} from './i18n-constants.js'

// __dirname is not defined in ES module scope
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const i18nConfig = {
  locales,
  // defaultLocale,
  defaultLocale: 'fr',
  queryParameter: 'lang',
  header: 'accept-language',
  ignoreJSONStructure: false,
  localeExtension: 'json',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true,
  },
  detection: {
    // order and from where user language should be detected
    // order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    order: ['querystring'],
    // keys or params to lookup language from
    lookupQuerystring: 'lang',
    // lookupCookie: 'i18next',
    // lookupLocalStorage: 'i18nextLng',
    // lookupSessionStorage: 'i18nextLng',
    // lookupFromPathIndex: 0,
    // lookupFromSubdomainIndex: 0,

    // // cache user language on
    // caches: ['localStorage', 'cookie'],
    // excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

    // // optional expire and domain for set cookie
    // cookieMinutes: 10,
    // cookieDomain: '*.flexiness.com:*',

    // // optional htmlTag with lang attribute, the default is:
    // htmlTag: document.documentElement,

    // // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    // cookieOptions: { path: '/', sameSite: 'strict' }
  },
  directory: path.resolve(__dirname, 'locales'),
  backend: {
    loadPath: path.resolve(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    addPath: path.resolve(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
  }
}

export { i18nConfig }
