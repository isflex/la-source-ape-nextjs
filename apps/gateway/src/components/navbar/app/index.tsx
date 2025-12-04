'use client'

import React from 'react'
// import dynamic from 'next/dynamic'
import Link from 'next/link'
import classNames from 'classnames'
import routesActive from '@root/routes.active.json'
import routesMeta from '@root/routes.meta.json'
import { useGetPageNameClientSide } from '@src/utils'
import { useIsAdmin } from '@src/hooks/useIsAdmin'
import type { RoutesMetaConfig } from '@src/types/routes'

import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/navbar.module.scss'

const NavbarApp = ({mobileCheck} : {mobileCheck: boolean} ) => {
  const pageName = useGetPageNameClientSide()
  const isAdmin = useIsAdmin()

  return (
    <div className={stylesPage.navBarContainer}>
      {Object.entries(routesMeta as RoutesMetaConfig)
        .filter(([key, value]) => {
          // Support both formats:
          // 1. Old format: "segment" (e.g., "home")
          // 2. New format: "/full/path/" (e.g., "/planning/piscine/creer/")

          const isOldFormat = !key.startsWith('/')

          // Check 1: Active flag (default: false)
          // Routes must have active: true to be shown
          const isActive = value.active === true
          if (!isActive) {
            return false
          }

          // Check 2: Admin-only flag (default: false)
          // If admin: true, only show to admin users
          const isAdminOnly = value.admin === true
          if (isAdminOnly && !isAdmin) {
            return false
          }

          // Check 3: Current page exclusion (existing logic)
          if (isOldFormat) {
            // Old format: check against routesActive and match segment
            const isActiveInOldList = routesActive.includes(key)
            const isCurrentPage = pageName === `/${key}/`
            return isActiveInOldList && !isCurrentPage
          } else {
            // New format: check if it matches current page
            const isCurrentPage = pageName === key
            return !isCurrentPage
          }
        })
        .map(([key, value], index) => {
          // Construct href based on format
          const href = key.startsWith('/') ? key : `/${key}/`

          return (
            <span key={index} className={stylesPage.navItem}>
              <Text className={classNames(flexStyles.isInline)}>{value.emoji}</Text>
              {!mobileCheck && (
                <span style={{ height: '1.75rem'}} className={flexStyles.isHiddenMobile}>{'\u00A0 > \u00A0'}</span>
              )}
              <Link href={href} className={classNames(flexStyles.link)}>{value.navTitle}</Link>
            </span>
          )
        })
      }
    </div>
  )
}

export default NavbarApp
