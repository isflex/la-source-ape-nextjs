// import { headers } from 'next/headers'
// import { isMobile } from '@src/utils'
// import AdhesionEmbeddedIframe from './client-component-embedded-iframe'

// export default async function AdhesionPage() {
//   const userAgent = (await headers()).get('user-agent') || ''
//   const mobileCheck = isMobile(userAgent)

//   return <AdhesionEmbeddedIframe mobileCheck={mobileCheck} />
// }

import AdhesionContent from './client-component'

export default function AdhesionPage() {
  return <AdhesionContent />
}
