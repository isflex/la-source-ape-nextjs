
'use client'

import React from 'react'
// import dynamic from 'next/dynamic'
// import Link from 'next/link'
// import type { NextPage } from 'next'
import { PageAppProps } from '@root/types/additional'
import { useInView  } from 'react-intersection-observer'

import classNames from 'classnames'
import {
  // flexStyles,
  // Button,
  // ButtonMarkup,
  // Box,
  // Link as FlexLink,
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
import { Banner } from '@src/components/footer/cookieConsentBanner'
import LogoFlex from '@src/components/logo-flexiness'

interface FooterPagesProps extends PageAppProps {
}

// const Footer: NextPage<PageAppProps> = () => {
const Footer: React.FC<FooterPagesProps> = ({ adjustFooterPosition }) => {

  const AdjustFooter = () => {

    const [logoFlexInView, setLogoFlexInView] = React.useState<boolean>(false)

    const { ref } = useInView({
      /* Optional options */
      threshold: 0.25,
      delay: 100,
      initialInView: false,
      onChange: (inView) => {
        setLogoFlexInView(inView)
      },
    })

    return (
      <div className={stylesPage.footerContainer}>
        <Banner logoFlexInView={logoFlexInView} />
        <button className={flexStyles.btnStd} onClick={() => window.open('https://ci.flexiness.com', '_blank')}>
          <LogoFlex ref={ref} />
        </button>
      </div>
    )
  }

  const StaticFooter = () => {
    return (
      <div className={stylesPage.footerContainer}>
        <Banner logoFlexInView={false} />
      </div>
    )
  }

  return (
    <>
      {adjustFooterPosition ? (
        <AdjustFooter />
      ) : (
        <StaticFooter />
      )}
    </>
  )

}

export default Footer
