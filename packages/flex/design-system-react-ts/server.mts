/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
// https://expressjs.com/en/resources/middleware/serve-static.html#index
// https://stackoverflow.com/a/34716129/10159170

// function requireUncached(module) {
//   delete require.cache[require.resolve(module)]
//   return require(module)
// }
// const { optionsHTTPS } = requireUncached('@flexiness/certs')

// const tracer = require('dd-trace').init()

// const ddOptions = {
//   // eslint-disable-next-line camelcase
//   response_code: true,
//   tags: [
//     `app:${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`
//   ]
// }
// const connectDatadog = require('connect-datadog')(ddOptions)


import * as path from 'path'
import url, { fileURLToPath, parse } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// require.resolve for ES modules
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import subprocess from 'node:child_process'
import { promisify } from 'node:util'
const execPromise = promisify(subprocess.exec)

import { promises as fsPromise } from 'fs'

import http from 'http'
import https from 'https'
import Express from 'express'
import { ChunkExtractor } from '@loadable/server'
import Cors from 'cors'
import regexEscape from 'regex-escape'
import detect from 'detect-port'

const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
const { optionsHTTPS } = require('@flexiness/certs')
const { checkIsRoute, getContentSecurityPolicy, generateFlexCSPNonce, getFlexCSPNonce, setFlexCSPNonce } = require('@flexiness/domain-utils')

import ejs from 'ejs'
ejs.delimiter = '?'; // Means instead use __webpack_nonce__ = '<?=nonce?>'

// import findWorkspaceRoot from 'find-yarn-workspace-root'
// const workspacePath = findWorkspaceRoot(__dirname)
// const rootLocation = path.relative(__dirname, workspacePath!)
const rootLocation = process.env.FLEX_PROJ_ROOT

let _gitCommitSHA = ''
async function getGitCommitSHA() {
  const result = await execPromise(`${process.env.FLEX_PROJ_ROOT}/bin/run-get-git-commit.sh`)
  const { stdout, stderr } = result
  if (stderr) Promise.reject(stderr)
  return Promise.resolve(stdout.trim())
}
_gitCommitSHA = await getGitCommitSHA()
console.log(`Git Commit SHA :`, _gitCommitSHA)

const accessFile = async (path: string) => {
  try {
    await fsPromise.access(path)
    // console.log(path)
    return path
  } catch {
    return false
  }
}

const FLEX_SERVER_RUNNING = process.env.FLEX_SERVER_RUNNING
const PORT = `${process.env.FLEX_DESIGN_SYS_REACT_TS_PORT}`
const HOST = `${process.env.FLEX_PROTOCOL}${process.env.FLEX_DESIGN_SYS_REACT_TS_HOSTNAME}:${PORT}`

console.log(`env : FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS=${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`)

const servePath = path.join(
  __dirname, 'build',
  `${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`,
  `${process.env.FLEX_DESIGN_SYS_REACT_TS_TARGET}`
)
// console.log('servePath', servePath)

const stylesServePath = path.join(
  `${process.env.FLEX_PROJ_ROOT}`,
  'apps/la-source/ape/on-board/client/',
  'build',
  `${process.env.FLEX_POKER_CLIENT_BUILD_SYS}`,
  `${process.env.FLEX_POKER_CLIENT_TARGET}`,
)
// console.log('stylesServePath', stylesServePath)

const clientStats = await accessFile(path.join(stylesServePath, 'loadable-stats.json'))
let clientExtractor: Record<string, any>
let flexFrameworkStylesAsset: string
if (clientStats) {
  clientExtractor = new ChunkExtractor({ statsFile: clientStats, entrypoints: [`mainEntry_${process.env.FLEX_POKER_CLIENT_NAME}_${_gitCommitSHA}`] })
  // console.log(clientExtractor['stats']['assetsByChunkName'])
  flexFrameworkStylesAsset = clientExtractor['stats']['assetsByChunkName']['flex-framework-styles']
  // console.log('flex-framework-styles : ', flexFrameworkStylesAsset)
}

function setCustomCacheControl (res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

const corsOptions = Cors({
  ...(process.env.FLEX_MODE === 'development'
    ? { origin: '*' }
    : { origin: [
      new RegExp(`${regexEscape(process.env.FLEX_DOMAIN_NAME!)}`),
      new RegExp(`${regexEscape(`.${process.env.FLEX_BASE_DOMAIN!}`)}$`),
      new RegExp(`${regexEscape(process.env.FLEX_HOST_IP!)}$`),
      new RegExp(`${regexEscape(`localhost:${process.env.FLEX_GATEWAY_PORT!}`)}`),
      new RegExp(`${regexEscape(process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOST!)}`),
      new RegExp(`${regexEscape(process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME!)}`),
    ] }
  ),
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
})

let _nonce = ''
const readNonce = async () => {
  _nonce = JSON.parse(`${await fsPromise.readFile(`${rootLocation}/apps/la-source/ape/gateway/nonce.json`)}`)['nonce']
  setFlexCSPNonce(_nonce)
  // await parseHTML(_nonce)
  // console.log('_nonce', `${getFlexCSPNonce()}`)
}
const generateNonce = async ()  => {
  _nonce = await generateFlexCSPNonce()
  const save = await execPromise(`
    jq -n --arg base64 ${_nonce} '{"nonce":$base64}' > ${path.resolve(`${__dirname}`, 'nonce.json')} && \
    echo ${_nonce} > ${path.resolve(`${__dirname}`, 'nonce.txt')} && \
    echo export const __webpack_nonce__ = \\'${_nonce}\\' > ${path.resolve(`${__dirname}`, 'nonce_webpack.js')} && \
    export FLEX_CSP_NONCE=${_nonce} && \
    echo ${_nonce}
  `)
  const { stdout, stderr } = save
  if (stdout) {
    setFlexCSPNonce(stdout)
    if (process.env.DEBUG === 'true') console.log(`Gateway Express Custom Server csp nonce : ${getFlexCSPNonce()}`)
  }
  if (stderr) {
    console.log(stderr)
    Promise.reject(new Error('Cannot write nonce to json file'))
  }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////

detect(Number(PORT))
  .then(_port => {
    if (Number(PORT) === Number(_port)) {
      let _currentRoute = ''
      const app = Express()

      app.engine('ejs', ejs.renderFile)
      app.set('views', servePath)

      app.use(corsOptions)

      app.use(async(req, res, next) => {
        // console.log(`req port : ${req.socket.localPort}`)
        if (checkIsRoute(req.path)) {
          // console.log(`req path : ${req.path}`)
          // console.log(`req host : ${req.host}`)
          const parsedUrl = parse(url.format({
            protocol: req.protocol,
            host: req.host
          }))
          // console.log(`url parsed port`, parsedUrl.port)
          if (parsedUrl.port === PORT || parsedUrl.port === process.env.FLEX_PROXY_PORT) await generateNonce()
          if (parsedUrl.port === process.env.FLEX_GATEWAY_PORT) await readNonce()
          _currentRoute = req.path
        }
        res.locals.cspNonce = _nonce
        next()
      })

      // app.use(connectDatadog)

      // if (process.env.FLEX_MODE === 'production') {
        app.use((req, res, next) => {
          return getContentSecurityPolicy(req, res, next, _nonce)
        });
      // }

      // app.use(`/`, Express.static(servePath, {
      //   // index: ['index.html'],
      //   // maxAge: '1d',
      //   // setHeaders: setCustomCacheControl
      // }))

      app.use('/', Express.static(servePath))
      app.use('/styles', Express.static(stylesServePath))
      app.use(`/${process.env.FLEX_POKER_CLIENT_PROXY_PATHNAME}`, Express.static(servePath))

      app.use('/node', Express.static(path.join(__dirname, 'build', `${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`, 'node'), {
        // index: ['index.html'],
        // maxAge: '1d',
        // setHeaders: setCustomCacheControl
      }))

      app.use('/web', Express.static(path.join(__dirname, 'build', `${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`, 'web'), {
        // index: ['index.html'],
        // maxAge: '1d',
        // setHeaders: setCustomCacheControl
      }))

      // if (process.env.FLEX_MODE === 'production') {
      //   const webpackAsset = `${fs.readFileSync(path.join(__dirname, 'assets.json'))}`
      //   const webpackAssetParsed = JSON.parse(webpackAsset)
      //   const webpackAssetCSS = webpackAssetParsed['']['css']
      //   // console.log(JSON.stringify(webpackAssetCSS))
      //   const _nonce = JSON.parse(fs.readFileSync(`${process.env.FLEX_PROJ_ROOT}/packages/gateway/nextjs-telenko/nonce.json`)).nonce
      //   const linkTagCSS = () => {
      //     return Array.isArray(webpackAssetCSS)
      //       ? webpackAssetCSS.map((css) =>
      //         `<link nonce="${_nonce}" href="${css}" data-target="flex-css" rel="stylesheet" type="text/css" crossorigin="anonymous" />`.trim()).join('\n\r')
      //       : `<link nonce="${_nonce}" href="${webpackAssetCSS}" data-target="flex-css" rel="stylesheet" type="text/css" crossorigin="anonymous" />`
      //   }
      //   // console.log(linkTagCSS())
      //   // Based on template generated by HtmlWebpackPlugin
      //   app.get('/web', (req, res) => {
      //     res.send(`
      //       <!doctype html>
      //       <html>
      //         <head>
      //           <script defer="defer" src="${webpackAssetParsed[`mainEntry_${process.env.FLEX_DESIGN_SYS_REACT_TS_NAME}`]['js']}"></script>
      //           ${linkTagCSS()}
      //         </head>
      //         <body>
      //           <div id="root"></div>
      //           <script src="https://a7.bouyguestelecom.fr/trilogy-slider-0.0.4/dist/trilogy-slider.min.js"></script>
      //           <script src="${process.env.FLEX_CONTENT_HOST}/jsrsasign.js"></script>
      //         </body>
      //       </html>
      //     `)
      //   })
      // }

      app.use('/node', serveIndex(path.join(__dirname, 'build', `${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`, 'node'), {
        icons: true
      }))

      app.use('/web', serveIndex(path.join(__dirname, 'build', `${process.env.FLEX_DESIGN_SYS_REACT_TS_BUILD_SYS}`, 'web'), {
        icons: true
      }))

      // app.use(nocache());

      app.route('/').get(async (req, res) => {
        res.render(path.join(servePath, 'index.ejs'), {
          nonce: res.locals.cspNonce,
          ...(flexFrameworkStylesAsset !== 'undefined' &&
            {
              flexFrameworkStyles: `/styles/${flexFrameworkStylesAsset}`
            }
          )
        })
      })

      const server = `${process.env.FLEX_PROTOCOL}` === 'http://'
        ? http.createServer(app)
        : https.createServer(optionsHTTPS(), app)

      server.listen(Number(PORT), `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOSTNAME}`, 34, () => {
        console.log(`[${process.env.FLEX_PROTOCOL?.slice(0, -3).toUpperCase()}] : ${HOST} :`, server.address())
        console.log(`${FLEX_SERVER_RUNNING} ${HOST}`)
      })

      // https://stackoverflow.com/questions/53079611/handling-node-http-serverlisten-error-with-callback

      // const server = app.listen(PORT, `${process.env.FLEX_DESIGN_SYS_REACT_TS_HOSTNAME}`, 34, (err) => {
      //   if (err) throw err
      //   console.log(`[${process.env.FLEX_PROTOCOL.slice(0, -3).toUpperCase()}] : ${HOST} :`, server.address())
      //   console.log(`${FLEX_SERVER_RUNNING} ${HOST}`)
      // })

    } else {
      console.log(`ALREADY RUNNING ${HOST}`)
      console.log(`${FLEX_SERVER_RUNNING} ${HOST}`)
      // process.exit(0);
      process.kill(process.pid, 0)
    }
  })
  .catch(err => {
    console.log(err)
  })
