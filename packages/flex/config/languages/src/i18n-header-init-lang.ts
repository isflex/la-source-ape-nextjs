import { IncomingHttpHeaders } from 'http'
import { Request } from 'express'

interface CustomRequest extends Request {
  initLng?: string
  headers: IncomingHttpHeaders & {
    ['Flex-Lng-Header']?: string
  }
}

export type { CustomRequest }
