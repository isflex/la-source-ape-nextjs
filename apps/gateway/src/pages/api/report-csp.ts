/* eslint-disable no-console */

// https://www.moesif.com/blog/technical/logging/How-we-built-a-Nodejs-Middleware-to-Log-HTTP-API-Requests-and-Responses/
// https://www.npmjs.com/package/neverthrow

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const requestStart = Date.now()

  // ========== REQUEST HANLDING ==========
  let body: any[] = []
  let requestErrorMessage: string | null = null

  const getChunk = (chunk: any) => body.push(chunk)
  const assembleBody = () => {
    // @ts-expect-error
    body = Buffer.concat(body).toString()
  }
  const getError = (error: Error) => {
    requestErrorMessage = error.message
  }
  request.on('data', getChunk)
  request.on('end', assembleBody)
  request.on('error', getError)

  // ========== RESPONSE HANLDING ==========
  const logClose = () => {
    removeHandlers()
    log(request, response, 'Client aborted.')
  }
  const logError = (error: Error) => {
    removeHandlers()
    log(request, response, error.message)
  }
  const logFinish = () => {
    removeHandlers()
    log(request, response, requestErrorMessage)
  }
  response.on('close', logClose)
  response.on('error', logError)
  response.on('finish', logFinish)

  // ========== CLEANUP ==========
  const removeHandlers = () => {
    request.off('data', getChunk)
    request.off('end', assembleBody)
    request.off('error', getError)
    response.off('close', logClose)
    response.off('error', logError)
    response.off('finish', logFinish)
  }

  const log = (request: NextApiRequest, response: NextApiResponse, errorMessage: string | null) => {
    const { rawHeaders, httpVersion, method, socket, url } = request
    const { remoteAddress, remoteFamily } = socket

    const { statusCode, statusMessage } = response
    const headers = response.getHeaders()

    console.log(
      JSON.stringify({
        timestamp: Date.now(),
        processingTime: Date.now() - requestStart,
        rawHeaders,
        body,
        errorMessage,
        httpVersion,
        method,
        remoteAddress,
        remoteFamily,
        url,
        response: {
          statusCode,
          statusMessage,
          headers
        }
      })
    )
  }
}
