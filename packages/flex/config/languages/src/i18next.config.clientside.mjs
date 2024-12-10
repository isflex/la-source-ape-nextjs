import { locales, defaultLocale } from './i18n-constants.js'

const i18nConfig = {
  locales,
  defaultLocale,
  queryParameter: 'lang',
  header: 'accept-language',
  ignoreJSONStructure: false,
  localeExtension: 'json',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  react: {
    bindI18n: 'languageChanged loaded initialized',
    bindI18nStore: 'added removed initialized',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true
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
  // backend: {
  //   loadPath: './locales/{{lng}}/{{ns}}.json',
  //   addPath: './locales/{{lng}}/{{ns}}.missing.json',
  // },
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
}

export { i18nConfig }
