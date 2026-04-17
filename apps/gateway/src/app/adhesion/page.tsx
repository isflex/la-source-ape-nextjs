// import { headers } from 'next/headers'
// import { isMobile } from '@src/utils'
// import AdhesionContent from './client-component-embedded-iframe'

// export default async function AdhesionPage() {
//   const userAgent = (await headers()).get('user-agent') || ''
//   const mobileCheck = isMobile(userAgent)

//   return <AdhesionContent mobileCheck={mobileCheck} />
// }

import AdhesionContent from './client-component-redirect-native-form'

export default function AdhesionPage() {
  return <AdhesionContent />
}
