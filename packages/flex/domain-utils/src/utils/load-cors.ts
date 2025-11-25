
import Cors from 'cors'

// TypeScript declaration for experimental RegExp.escape
declare global {
  interface RegExpConstructor {
    escape?: (str: string) => string
  }
}

interface CorsConfigOptions {
  includeGatewayPort?: boolean
  includeWebpack?: boolean
  methods?: string[]
  allowedHeaders?: string[]
  credentials?: boolean
}

// Use native RegExp.escape when available, fallback otherwise
const regexEscape = (str: string) => {
  if (RegExp.escape) {
    return RegExp.escape(str)
  }
  // Fallback implementation for when RegExp.escape is not available
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const createCorsOrigins = (options: CorsConfigOptions = {}): RegExp[] => {
  const origins: RegExp[] = []

  if (options.includeWebpack) {
    origins.push(new RegExp(`${regexEscape(`webpack://_N_E`)}`))
  }

  if (options.includeGatewayPort) {
    origins.push(new RegExp(`${regexEscape(`localhost:${process.env.FLEX_GATEWAY_PORT!}`)}`))
  }

  origins.push(
    new RegExp(`${regexEscape(`${process.env.FLEX_HOST_IP!}`)}$`),
    new RegExp(`${regexEscape(`${process.env.FLEX_DOMAIN_NAME!}`)}`),
    new RegExp(`${regexEscape(`.${process.env.FLEX_BASE_DOMAIN!}`)}$`),
    new RegExp(`${regexEscape(`${process.env.FLEX_FUTUR_PROOF_1_BASE_DOMAIN!}`)}`),
    new RegExp(`${regexEscape(`.${process.env.FLEX_FUTUR_PROOF_1_BASE_DOMAIN!}`)}$`),
    new RegExp(`${regexEscape(`${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN!}`)}`),
    new RegExp(`${regexEscape(`.${process.env.FLEX_FUTUR_PROOF_2_BASE_DOMAIN!}`)}$`),
    new RegExp(`${regexEscape(`${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_BASE_DOMAIN!}`)}`),
    new RegExp(`${regexEscape(`.${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_1_BASE_DOMAIN!}`)}$`),
    new RegExp(`${regexEscape(`${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_BASE_DOMAIN!}`)}`),
    new RegExp(`${regexEscape(`.${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_2_BASE_DOMAIN!}`)}$`)
  )

  return origins
}

export const loadCorsOriginsGateway = () => {
  return createCorsOrigins({ includeWebpack: true })
}

export const loadCorsOrigins = () => {
  return createCorsOrigins({ includeGatewayPort: true })
}

export const createFlexCorsOptions = (options: CorsConfigOptions = {}) => {
  const defaultMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
  const defaultHeaders = [
    'Content-Type',
    'Authorization',
    'x-flex-csp-nonce',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Credentials',
    'x-flex-custom-domain',
    'x-flex-custom-key',
    'x-api-key',
    'x-amplify-user-agent',
    'x-amz-date',
    'x-amz-security-token',
    'x-amz-user-agent',
  ]

  if (process.env.FLEX_MODE === 'development') {
    return {
      origin: '*',
      methods: options.methods || defaultMethods,
      allowedHeaders: options.allowedHeaders || defaultHeaders,
      credentials: options.credentials !== false
    }
  }

  return {
    origin: createCorsOrigins(options),
    methods: options.methods || defaultMethods,
    allowedHeaders: options.allowedHeaders || defaultHeaders,
    credentials: options.credentials !== false
  }
}

export const createFlexCorsMiddleware = (options: CorsConfigOptions = {}) => {
  return Cors(createFlexCorsOptions(options))
}

export const createMcpCorsOrigins = () => {
  if (process.env.FLEX_MODE === 'development') {
    return [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:4009',
      '*'
    ]
  }

  return createCorsOrigins().map(regex => regex.source.replace(/\$$/,''))
}
