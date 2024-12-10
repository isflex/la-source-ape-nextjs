/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */

// https://stackoverflow.com/questions/68458931/module-not-found-error-cant-resolve-crypto-react-typescript-webpack
// import crypto from 'crypto'
// import * as crypto from 'crypto-browserify'
import { Sha256 } from '@aws-crypto/sha256-js'
import { v4 as uuidv4 } from 'uuid'

import { parseRemoteUrl } from './parse-remote-url.js'
import { Nonce, FlexGlobalThis } from 'flexiness'

declare let globalThis: FlexGlobalThis

/**
 * Generate randomly generated nonce (base64) for Content Security Policy.
 *
 * @returns {string}
 */
const generateNonce = async () => {
  // generate random nonce converted to base64. Must be different on every HTTP page load
  // const hash = crypto.createHash('sha256')
  // hash.update(uuidv4())
  // const nonce = hash.digest('base64')

  // https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  // const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const hash = new Sha256()
  hash.update(uuidv4())
  const nonce = Buffer.from(await hash.digest()).toString('base64') as unknown as Nonce

  return nonce
}

export function setFlexCSPNonce(nonce: Nonce) {
  const FlexCSPNonce = nonce
  globalThis.Flexiness = {
    ...globalThis.Flexiness,
    domainApp: { ...globalThis.Flexiness?.domainApp, FlexCSPNonce },
  }
}

export async function generateFlexCSPNonce() {
  const FlexCSPNonce: Nonce = await generateNonce()
  setFlexCSPNonce(FlexCSPNonce)
  return FlexCSPNonce
}

export function getFlexCSPNonce() {
  return globalThis.Flexiness?.domainApp?.FlexCSPNonce
}

export async function fetchFlexCSPNonce(apiUrl: URL['origin']) {
  if (getFlexCSPNonce()) {
    return getFlexCSPNonce()
  } else {
    // https://dmitripavlutin.com/javascript-fetch-async-await/
    const response = await fetch(`${parseRemoteUrl(`${apiUrl}/api/nonce`)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': `${window.location.origin}`,
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
    const data = await response.json()
    setFlexCSPNonce(data.nonce)
    return getFlexCSPNonce()
  }
}
