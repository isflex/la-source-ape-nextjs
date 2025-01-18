import React from 'react'
// import dynamic from 'next/dynamic'
import Link from 'next/link'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
import pagesRoutes from '@root/pages.active.routes.json'
import pagesMeta from '@root/pages.meta.json'

import {
  flexStyles,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as stylesPage } from '@src/styles/scss/pages/navbar.module.scss'

import {
  PageAppProps,
} from '@root/types/additional'

const stores = getStores()

const Navbar: React.FC<PageAppProps> = observer((props) => {
  return (
    <div className={stylesPage.navBarContainer}>
      {Object.entries(pagesMeta)
        .filter(([key, value], index) => pagesRoutes.includes(key) && key !== props.pageName)
        .map(([key, value], index) => {
          return (
            <span key={index}>
              <Text className={classNames(flexStyles.isInline)}>{value.emoji}</Text>{'\u00A0'}
              <Link href={`/${key}`} className={flexStyles.link}>{value.navTitle}</Link>
            </span>
          )
        })
      }
    </div>
  )
})

export default Navbar
