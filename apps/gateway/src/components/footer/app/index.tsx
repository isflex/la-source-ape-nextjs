
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
// import Link from 'next/link'
// import type { NextPage } from 'next'
// import { PageAppProps } from '@root/types/additional'
import { useInView } from 'react-intersection-observer'

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  // Box,
  Link,
  // Text,
  // Title,
  // TitleLevel,
  // VariantState,
  // IconName,
  // InfoBlock,
  // InfoBlockAction,
  // InfoBlockContent,
  // InfoBlockHeader,
  // InfoBlockStatus,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/footer.module.scss'
import { default as stylesLogo } from '@src/styles/scss/pages/logo.module.scss'
import { Banner } from '@src/components/footer/cookieConsentBanner'
import LogoFlex from '@src/components/logo-flexiness'

interface FooterAppProps {
}

// const Footer: NextPage<PageAppProps> = () => {
const Footer: React.FC<FooterAppProps> = ({}) => {
  const [logoFlexInView, setLogoFlexInView] = React.useState<boolean>(false)

  const { ref } = useInView({
    /* Optional options */
    threshold: 0.25,
    delay: 100,
    initialInView: false,
    onChange: (inView) => {
      setLogoFlexInView(inView)
    },
  });

  return (
    <div className={stylesPage.footerContainer}>
      <Banner logoFlexInView={logoFlexInView} />
      <div className={stylesPage.footerPage}>
        <small>
          <Link href={`/privacy_policy`} target='_blank' rel='privacy-policy'>politique de confidentialité</Link>
        </small>
        <button className={flexStyles.btnStd} onClick={() => window.open('https://ci.flexiness.com', '_blank')}>
          <LogoFlex ref={ref} className={stylesLogo.logoFooter} />
        </button>
        <small>
          <Link href={`/terms_of_service`} target='_blank' rel='terms-of-service'>conditions générales d&apos;utilisation</Link>
        </small>
      </div>
    </div>
  )
}

export default Footer
