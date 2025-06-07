const whiteList = {
  styleSrc: ['https://*.googleapis.com', 'https://api.iconify.design', 'https://cognito-idp.eu-west-3.amazonaws.com/'],
  styleSrcElem: ['https://*.googleapis.com', 'https://api.iconify.design'],
  styleSrcAttr: ['https://*.googleapis.com', 'https://api.iconify.design'],
  fontSrc: ['https://fonts.gstatic.com'],
  imgSrc: [
    'https://*.googleapis.com',
    'https://*.gstatic.com',
  ],
  connectSrc: [
    `ws://${process.env.FLEX_POKER_BACK_HOSTNAME}:${process.env.FLEX_POKER_BACK_PORT}/ws`,
    `wss://${process.env.FLEX_POKER_BACK_HOSTNAME}:${process.env.FLEX_POKER_BACK_PORT}/ws`,
    `https://${process.env.FLEX_AWS_COGNITO_OAUTH_DOMAIN}`,
    `${process.env.FLEX_AWS_APPSYNC_GRAPHQL_ENDPOINT}`,
    `${process.env.FLEX_AWS_APPSYNC_GRAPHQL_ENDPOINT_REALTIME}`,
    'https://cognito-identity.eu-west-3.amazonaws.com/',
    'https://cognito-idp.eu-west-3.amazonaws.com/',
    'https://*.googleapis.com',
    'https://*.gstatic.com',
    '*.google.com',
  ],
  scriptSrc: [
    'https://*.googleapis.com',
    'https://*.gstatic.com',
    '*.google.com',
    'https://*.ggpht.com',
    '*.googleusercontent.com',
  ],
}

export { whiteList }
