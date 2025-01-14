/* eslint-disable no-console */

'use client'

import React from 'react'
import { isServer } from '@flexiness/domain-utils'
import { Amplify, type ResourcesConfig } from 'aws-amplify'
// import { parseAmplifyConfig } from '@aws-amplify/core/internals/utils'
import { AMPLIFY_AUTH_CONFIG_V2 } from '@src/utils/amplify-configure'
import { Authenticator } from '@aws-amplify/ui-react'

// import { CookieStorage } from 'aws-amplify/utils'
// import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'

const _getConfig = () => {
  // if (process.env.FLEX_MODE === 'development' && process.env.FLEX_GATEWAY_USE_AMPLIFY_SANDBOX === 'true') {
  //   // void import(process.env.CI ? '' : '@root/amplify_outputs.json')
  //   void import('@root/amplify_outputs.json')
  //     .then((devSandBoxConfig) => {
  //       console.log(devSandBoxConfig.default)
  //       return parseAmplifyConfig(devSandBoxConfig.default)
  //     })
  //     .catch((err: Error) => {
  //       console.log(err)
  //     })
  // }
  const prodConfig = {
    ...AMPLIFY_AUTH_CONFIG_V2,
  } as ResourcesConfig
  return prodConfig
}

Amplify.configure(_getConfig(), { ssr: true })

// cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>
}

export default AuthProvider