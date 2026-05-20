import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
import { isFeatureEnabled } from '@src/lib/feature-flags'
import AdhesionContent from './client-component-embedded-iframe'
import AdhesionUnavailable from './client-component-unavailable'

export default async function AdhesionPage() {
  if (!isFeatureEnabled('ADHESION_ENABLED')) {
    return <AdhesionUnavailable />
  }

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)

  return <AdhesionContent mobileCheck={mobileCheck} />
}

// import AdhesionContent from './client-component-redirect-native-form'

// export default function AdhesionPage() {
//   return <AdhesionContent />
// }
