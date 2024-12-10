/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
// https://expressjs.com/en/resources/middleware/serve-static.html#index
// https://stackoverflow.com/a/34716129/10159170

// const tracer = require('dd-trace').init()

// const ddOptions = {
//   // eslint-disable-next-line camelcase
//   response_code: true,
//   tags: [
//     `app:${process.env.FLEX_CONTENT_NAME}`
//   ]
// }
// const connectDatadog = require('connect-datadog')(ddOptions)

const { optionsHTTPS } = require('@flexiness/certs')
const http = require('http')
const https = require('https')
const express = require('express')
// const connect = require('connect')
const path = require('path')
const serveStatic = require('serve-static')
const serveIndex = require('serve-index')
// const vhost = require('vhost')
const cors = require('cors')
const regexEscape = require('regex-escape')
// const nocache = require('nocache')
const detect = require('detect-port')

const FLEX_SERVER_RUNNING = process.env.FLEX_SERVER_RUNNING
const PORT = process.env.FLEX_CONTENT_PORT
const HOST = `${process.env.FLEX_PROTOCOL}${process.env.FLEX_CONTENT_HOSTNAME}:${PORT}`

function setCustomCacheControl (res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

const corsOptions = {
  ...(process.env.FLEX_MODE === 'development'
    ? { origin: '*' }
    : { origin: [
      new RegExp(`${regexEscape(process.env.FLEX_DOMAIN_NAME)}`),
      new RegExp(`${regexEscape(`.${process.env.FLEX_BASE_DOMAIN}`)}$`),
      new RegExp(`${regexEscape(process.env.FLEX_HOST_IP)}$`)
    ] }
  ),
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////

detect(PORT)
  .then(_port => {
    if (Number(PORT) === Number(_port)) {
      const app = express()

      app.use(cors(corsOptions))

      // app.use(connectDatadog)

      // serve the actual files
      app.use('/', express.static(path.join(__dirname, 'content'), {
        // maxAge: '1d',
        // setHeaders: setCustomCacheControl
      }))

      // shows you the directory/file list at app root
      app.use('/', serveIndex(path.join(__dirname, 'content'), {
        icons: true
      }))

      const server = `${process.env.FLEX_PROTOCOL}` === 'http://'
        ? http.createServer(app)
        : https.createServer(optionsHTTPS(), app)

      server.listen(PORT, `${process.env.FLEX_CONTENT_HOSTNAME}`, 34, (err) => {
        if (err) throw err
        console.log(`[${process.env.FLEX_PROTOCOL.slice(0, -3).toUpperCase()}] : ${HOST} :`, server.address())
        console.log(`${FLEX_SERVER_RUNNING} ${HOST}`)
      })

      // const server = app.listen(PORT, `${process.env.FLEX_CONTENT_HOSTNAME}`, 34, (err) => {
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

// /////////////////////////////////////////////////////////////////////////////////////////////////////

// https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http/24575241#24575241
// const http = require('http')
// const https = require('https')
// const fs = require('fs')
// const path = require('path')

// process.on('uncaughtException', err => console.error('uncaughtException', err));
// process.on('unhandledRejection', err => console.error('unhandledRejection', err));

// const FLEX_PROTOCOL = process.env.FLEX_PROTOCOL;
// const FLEX_DOMAIN_NAME = process.env.FLEX_DOMAIN_NAME;
// const PORT = process.env.FLEX_CONTENT_PORT;

// const publicFolder = process.argv.length > 2 ? process.argv[2] : '.'
// // const port = process.argv.length > 3 ? process.argv[3] : 8080

// const mediaTypes = {
//   zip: 'application/zip',
//   jpg: 'image/jpeg',
//   html: 'text/html',
//   ico: 'image/x-icon',
//   js: 'text/javascript',
//   json: 'application/json',
//   css: 'text/css',
//   png: 'image/png',
//   wav: 'audio/wav',
//   mp3: 'audio/mpeg',
//   svg: 'image/svg+xml',
//   pdf: 'application/pdf',
//   doc: 'application/msword'
//   /* add more media types */
// }

// const server = http.createServer(function(request, response) {
//   console.log(request.method + ' ' + request.url)

//   const filepath = path.join(publicFolder, request.url)
//   fs.readFile(filepath, function(err, data) {
//     if (err) {
//       response.statusCode = 404
//       return response.end('File not found or you made an invalid request.')
//     }

//     let mediaType = 'text/html'
//     const ext = path.extname(filepath)
//     if (ext.length > 0 && mediaTypes.hasOwnProperty(ext.slice(1))) {
//       mediaType = mediaTypes[ext.slice(1)]
//     }

//     response.setHeader('Content-Type', mediaType)
//     response.end(data)
//   })
// });

// server.on('clientError', function onClientError(err, socket) {
//   console.log('clientError', err)
//   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
// });

// server.listen(PORT, () => console.log(`Available on: ${FLEX_PROTOCOL}${FLEX_DOMAIN_NAME}:${PORT}`));
