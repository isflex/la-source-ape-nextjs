/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as path from 'path'
import fs, { PathLike } from 'fs'

const FLEX_DOMAIN_NAME = process.env.FLEX_DOMAIN_NAME
const HOME =  process.env.HOME

const optionsHTTPSMkCert = () => {
  return {
    key: fs.existsSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/privkey.pem`)
      ? fs.readFileSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/privkey.pem`, 'utf8')
      : fs.readFileSync(`${HOME}/certs/${FLEX_DOMAIN_NAME}/mkcert/privkey.pem`, 'utf8'),
    cert: fs.existsSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/fullchain.pem`)
      ? fs.readFileSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/fullchain.pem`, 'utf8')
      : fs.readFileSync(`${HOME}/certs/${FLEX_DOMAIN_NAME}/mkcert/fullchain.pem`, 'utf8'),
  }
}

const optionsHTTPSMkCertPathsRelative = (dir: PathLike) => {
  return {
    key: fs.existsSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/privkey.pem`)
      ? path.relative(`${dir as string}`, `/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/privkey.pem`)
      : path.relative(`${dir as string}`, `${HOME}/certs/${FLEX_DOMAIN_NAME}/mkcert/privkey.pem`),
    cert: fs.existsSync(`/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/fullchain.pem`)
      ? path.relative(`${dir as string}`, `/etc/letsencrypt/live/${FLEX_DOMAIN_NAME}/fullchain.pem`)
      : path.relative(`${dir as string}`, `${HOME}/certs/${FLEX_DOMAIN_NAME}/mkcert/fullchain.pem`),
  }
}

export { optionsHTTPSMkCert as optionsHTTPS, optionsHTTPSMkCertPathsRelative as optionsHTTPSPathsRelative }
