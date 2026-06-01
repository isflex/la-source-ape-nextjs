'use client';

import React, { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import classNames from 'classnames'
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { default as flexStyles } from '@flex-design-system/framework'
import { debug } from '@flexiness/domain-utils'

interface NewsletterContentPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default function NewsletterContentPage({ params }: NewsletterContentPageProps) {
  const { slug: slugArray } = use(params)
  const [ContentComponent, setContentComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  // If we reach here, layout has already handled creer/souscrire redirects
  // This page only handles dynamic content from _content folder

  useEffect(() => {
    if (!slugArray || slugArray.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- set 404 state when slug missing on mount
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
        debug.error(`Content not found at path: ${slugArray.join('/')}`, error)
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
      <Box className={classNames(flexStyles.hasTextTertiary)}>
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
