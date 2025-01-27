import React from 'react'
// import dynamic from 'next/dynamic'
import Link from 'next/link'
import { observer } from 'mobx-react-lite'
import { getStores } from '@flexiness/domain-store'
import routesActive from '@root/routes.active.json'
import routesMeta from '@root/routes.meta.json'

import classNames from 'classnames'
import {
  // flexStyles,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/navbar.module.scss'

import {
  PageAppProps,
} from '@root/types/additional'

const stores = getStores()

const NavbarPages: React.FC<PageAppProps> = observer((props) => {
  return (
    <div className={stylesPage.navBarContainer}>
      {Object.entries(routesMeta)
        .filter(([key, value], index) => routesActive.includes(key) && key !== props.pageName)
        .map(([key, value], index) => {
          return (
            <span key={index} className={stylesPage.navItem}>
              <Text className={classNames(flexStyles.isInline)}>{value.emoji}</Text>{'\u00A0'}
              <Link href={`/${key}`} className={flexStyles.link}>{value.navTitle}</Link>
            </span>
          )
        })
      }
    </div>
  )
})

export default NavbarPages
