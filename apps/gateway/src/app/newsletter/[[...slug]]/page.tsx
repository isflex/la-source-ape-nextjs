'use client';

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import classNames from 'classnames'
import {
  Box,
  Button,
  ButtonMarkup,
  Container,
  Section,
  Title,
  TitleLevel,
  VariantState,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

export default function NewsletterContentPage() {
  const params = useParams()
  const router = useRouter()
  const slugArray = params.slug as string[] | undefined
  const slugBase = slugArray?.[0] // Get first segment of the slug array

  const [ContentComponent, setContentComponent] = useState<React.ComponentType | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [contentNotFound, setContentNotFound] = useState(false)

  // Handle redirects to static souscrire route
  const shouldRedirectToSouscrire = !slugArray || slugArray.length === 0 || slugBase === 'souscrire'

  // Always call useEffect hooks at the top level
  useEffect(() => {
    if (shouldRedirectToSouscrire) {
      router.push('/newsletter/souscrire/')
    }
  }, [shouldRedirectToSouscrire, router])

  // Single useEffect to handle content dynamic imports
  useEffect(() => {
    if (shouldRedirectToSouscrire) {
      return // Don't load content if redirecting
    }

    const loadComponent = async () => {
      setIsLoadingContent(true)
      setContentNotFound(false)
      setContentComponent(null)

      try {
        // Try to load content from _content folder
        const contentPath = slugArray.join('/')
        const moduleImport = await import(`./_content/${contentPath}/index`)
        setContentComponent(() => moduleImport.default)
      } catch (error) {
        console.error(`Content not found at path: ${slugArray.join('/')}`, error)
        setContentNotFound(true)
      } finally {
        setIsLoadingContent(false)
      }
    }

    loadComponent()
  }, [slugArray, shouldRedirectToSouscrire])

  if (shouldRedirectToSouscrire) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Redirection...</div>
      </div>
    )
  }

  if (isLoadingContent) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Chargement...</div>
      </div>
    )
  }

  if (ContentComponent) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <ContentComponent />
      </div>
    )
  }

  // Show content not found
  return (
    <Container>
      <Box className={classNames(flexStyles.hasTextTeriary)}>
        <Section>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
            Contenu introuvable
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
            <Button
              id="newsletter-subscribe-not-found"
              variant={VariantState.PRIMARY}
              markup={ButtonMarkup.BUTTON}
              onClick={() => router.push('/newsletter/souscrire/')}
            >
              S&apos;inscrire au newsletter
            </Button>
          </div>
        </Section>
      </Box>
    </Container>
  )
}
