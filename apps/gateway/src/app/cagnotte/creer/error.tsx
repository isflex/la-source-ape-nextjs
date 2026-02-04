'use client'

import React from 'react'
import classNames from 'classnames'
import { Button } from '@flex-design-system/react-ts/client-sync-styled-direct/button'
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text'
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects'
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block'
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon'
import { default as flexStyles } from '@flex-design-system/framework'
import posthog from 'posthog-js'
import { logClientError } from '@src/app/actions/log-error'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CagnotteCreerError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = React.useState(false)

  React.useEffect(() => {
    // Log the error to PostHog (client-side)
    posthog.captureException(error)

    // Also log via server action for CloudWatch
    logClientError({
      errorName: error.name,
      errorMessage: error.message,
      errorDigest: error.digest,
      route: '/cagnotte/creer/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    })

    // Log to console for debugging
    console.error('[CagnotteCreer Error]', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      isCopilotKitError: error.message?.includes('CopilotKit') || error.message?.includes('useCopilotKit') || error.message?.includes('subscribe'),
    })
  }, [error])

  const isCopilotKitError = error.message?.includes('CopilotKit') || error.message?.includes('useCopilotKit') || error.message?.includes('subscribe')

  return (
    <section className={classNames(flexStyles.isFullwidth)} style={{ padding: '2rem' }}>
      <InfoBlock>
        <InfoBlockHeader
          status={InfoBlockStatus.WARNING}
          customIcon={IconName.UI_EXCLAMATION_CIRCLE}
        >
          <Title level={TitleLevel.LEVEL3}>
            {`Une erreur s'est produite sur cette page`}
          </Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Title level={TitleLevel.LEVEL4}>
            {`Nous sommes désolés, la page Cagnotte ne peut pas être chargée.`}
          </Title>

          {isCopilotKitError && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              padding: '1rem',
              marginTop: '1rem',
              marginBottom: '1rem'
            }}>
              <Text style={{ fontWeight: 'bold', color: '#856404' }}>
                ⚠️ Erreur CopilotKit détectée
              </Text>
              <Text style={{ color: '#856404', marginTop: '0.5rem' }}>
                {`L'assistant IA n'est pas disponible. Vérifiez que NEXT_PUBLIC_COPILOTKIT_ENABLED est configuré correctement.`}
              </Text>
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <Button
              small
              variant={VariantState.TERTIARY}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Masquer les détails' : 'Afficher les détails techniques'}
            </Button>
          </div>

          {showDetails && (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '1rem',
              marginTop: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'auto'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Nom:</strong> {error.name}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Message:</strong> {error.message}
              </div>
              {error.digest && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}>
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </InfoBlockContent>
        <InfoBlockAction>
          <div className={classNames(
            flexStyles.isFullwidth,
            flexStyles.isFlex,
            flexStyles.isAlignItemsCenter,
            flexStyles.isJustifyContentCenter,
            flexStyles.isFlexWrapWrap
          )} style={{ gap: '1rem' }}>
            <Button small variant={VariantState.FLEX_PINK} onClick={reset}>
              Réessayer
            </Button>
            <Button
              small
              variant={VariantState.SECONDARY}
              onClick={() => window.location.href = '/'}
            >
              {`Retour à l'accueil`}
            </Button>
          </div>
        </InfoBlockAction>
      </InfoBlock>
    </section>
  )
}
