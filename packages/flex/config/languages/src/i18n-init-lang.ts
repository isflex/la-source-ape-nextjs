/* eslint-disable no-console */
import type { FlexGlobalThis, ArrayElement } from 'flexiness'

declare let globalThis: FlexGlobalThis

const { parseRemoteUrl } = await import('@flexiness/domain-utils')

declare const process: {
  env: {
    FLEX_GATEWAY_HOST: string
    DEBUG: string
  }
}

type Logs = string[]
let logs: Logs

// import { Request } from 'express-serve-static-core'
import Express from 'express'
import accepts from 'accepts'
import { locales, defaultLocale } from './i18n-constants.js'
const isServer = typeof window === 'undefined'

const parseRequest = (request?: Express.Request) => {
  if (request) {
    const _accepts = accepts(request).languages()
    logs.push(`flexiness/languages serverside : accepts -> ${_accepts.toString()}`)
    const lang = request.acceptsLanguages(locales)
    if (lang) {
      logs.push(`flexiness/languages serverside : The first accepted of [${locales.toString()}] is -> ${lang}`)
      return lang
    } else {
      logs.push(`flexiness/languages serverside : None of [${locales.toString()}] is accepted`)
      return defaultLocale
    }
  }
  return defaultLocale
}

const fetchLngApi = async () => {
  // const _url = new URL(`${process.env.FLEX_GATEWAY_HOST}/api/initLng`)
  // const _parsedHref = _url.hostname === window.location.hostname
  //   ? _url.href : `${_url.protocol}//127.0.0.1:${_url.port || 80}${_url.pathname}`
  // https://dmitripavlutin.com/javascript-fetch-async-await/
  // const response = await fetch(`${_parsedHref}`, {
  const response = await fetch(`${parseRemoteUrl(`${process.env.FLEX_GATEWAY_HOST}/api/initLng`)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Origin: `${window.location.origin}`,
      // Origin: `${_url.origin}`,
    },
    mode: 'cors',
    // credentials: 'include',
    cache: 'default',
  })
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`
    console.log('////////////////////////////////////////////////////////////')
    console.log('// ENSURE GATEWAY IS RUNNING !!')
    console.log('////////////////////////////////////////////////////////////')
    throw new Error(message)
  }
  // const data = await response.json() as { initLng: string }
  const data = await response.json() as { initLng: ArrayElement<typeof locales> }
  return data?.initLng
}

const parseWindow = async () => {
  return (await fetchLngApi()) || new URLSearchParams(window?.location?.search).get('lang') || window.navigator.language || defaultLocale
}

const debugLog = (logs: Logs) => {
  if (process.env.DEBUG !== 'true') return
  console.log('///////////////////////////////////////////////////////////////////')
  logs.map((log) => {
    console.log(`${log}`)
  })
  console.log('///////////////////////////////////////////////////////////////////')
}

const initLang = async (request?: Express.Request) => {
  logs = []
  const initLng = isServer ? parseRequest(request) : await parseWindow()
  logs.push(`flexiness/languages init-lang ${initLng}`)
  globalThis.Flexiness = {
    ...(globalThis.Flexiness),
    domainApp: { ...globalThis.Flexiness?.domainApp, FlexLanguage: initLng },
  }
  debugLog(logs)
  return initLng
}

export { initLang }
