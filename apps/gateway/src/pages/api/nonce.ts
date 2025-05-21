/* eslint-disable no-console */

// api/nonce.js
// https://vercel.com/guides/loading-static-file-nextjs-api-route
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// require.resolve for ES modules
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { promises as fs } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
// import NextCors from 'nextjs-cors'
import escapeStringRegexp from 'escape-string-regexp'
const psl = require('psl')
const parsedDomain = psl.parse(`${process.env.FLEX_DOMAIN_NAME}`).domain

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   await NextCors(req, res, {
//     ...(process.env.FLEX_MODE === 'development'
//       ? { origin: '*' }
//       : { origin: [
//         new RegExp(`${escapeStringRegexp(`${process.env.FLEX_DOMAIN_NAME}`)}`)
//       ] }
//     ),
//     // origin: '*',
//     methods: ['GET'],
//     allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   })
//   // //Read the txt data file nonce.txt
//   const txtFileContents = await fs.readFile(path.resolve(__dirname, '../../../nonce.txt'), 'utf8')
//   // // eslint-disable-next-line no-console
//   // console.log(txtFileContents.replace(/^\n|\n$/g, ''))
//   // //Return the content of the data file in json format
//   res.status(200).json({ nonce: txtFileContents.replace(/^\n|\n$/g, '') })

//   // //Read the json data file nonce.json
//   // const jsonFileContents = await fs.readFile(path.resolve(__dirname, '../nonce.json'), 'utf8');
//   // //Return the content of the data file in json format
//   // res.status(200).json(jsonFileContents);
// }

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  ...(process.env.FLEX_MODE === 'development'
    ? { origin: '*' }
    : { origin: [
      new RegExp(`${escapeStringRegexp(`${process.env.FLEX_DOMAIN_NAME}`)}`),
      new RegExp(`${escapeStringRegexp(`.${parsedDomain}`)}$`),
      new RegExp(`${escapeStringRegexp(`webpack://_N_E`)}`)
    ] }
  ),
  // methods: ['POST', 'GET', 'HEAD'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  // preflightContinue: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        console.log(res)
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic
  const txtFileContents = await fs.readFile(path.resolve(__dirname, '../../../nonce.txt'), 'utf8')
  res.status(200).json({ nonce: txtFileContents.replace(/^\n|\n$/g, '') })
}
