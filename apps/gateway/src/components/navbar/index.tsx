import React from 'react'
// import dynamic from 'next/dynamic'
import Link from 'next/link'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
import pagesMeta from '@root/pages.meta.json'

import {
  flexStyles,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as stylesPage } from '@src/styles/scss/pages/navbar.module.scss'

import {
  PageAppProps,
} from '@root/types/additional'

import {
  FlexGlobalThis
} from 'flexiness'

declare let globalThis: FlexGlobalThis

const stores = getStores()

const Navbar: React.FC<PageAppProps> = observer((props) => {

  return (
    <div className={stylesPage.navBarContainer}>
      {props?.activeRoutes?.map((route, index) => {
        const navTitle = pagesMeta[route as keyof typeof pagesMeta] && pagesMeta[route as keyof typeof pagesMeta].navTitle
        const emoji = pagesMeta[route as keyof typeof pagesMeta] && pagesMeta[route as keyof typeof pagesMeta].emoji
        return (
          <span key={index}>
            <Text className={classNames(flexStyles.isInline)}>{emoji}</Text>{'\u00A0'}
            <Link href={`/${route}`} className={flexStyles.link}>{navTitle}</Link>
          </span>
        )
      })}
    </div>
  )
})

export default Navbar
