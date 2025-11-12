'use client';

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import classNames from 'classnames'
import {
  Box,
  Container,
  Section,
  Title,
  TitleLevel,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

interface NewsletterContentPageProps {
  params: {
    slug: string[]
  }
}

export default function NewsletterContentPage({ params }: NewsletterContentPageProps) {
  const slugArray = params.slug
  const [ContentComponent, setContentComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  // If we reach here, layout has already handled creer/souscrire redirects
  // This page only handles dynamic content from _content folder

  useEffect(() => {
    if (!slugArray || slugArray.length === 0) {
      setNotFoundError(true)
      setIsLoading(false)
      return
    }

    const loadContent = async () => {
      try {
        // Try to load content from _content folder
        const contentPath = slugArray.join('/')
        const moduleImport = await import(`./_content/${contentPath}/index`)
        setContentComponent(() => moduleImport.default)
      } catch (error) {
        console.error(`Content not found at path: ${slugArray.join('/')}`, error)
        setNotFoundError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [slugArray])

  if (notFoundError && !isLoading) {
    notFound()
  }

  if (isLoading) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
            Chargement...
          </Title>
        </Section>
      </Container>
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
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            Le contenu demandé &quot;{slugArray.join('/')}&quot; n&apos;existe pas.
          </p>
        </Section>
      </Box>
    </Container>
  )
}
