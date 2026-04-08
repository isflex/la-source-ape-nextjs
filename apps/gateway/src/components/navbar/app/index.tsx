'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import classNames from 'classnames'
import routesActive from '@root/routes.active.json'
import routesMeta from '@root/routes.meta.json'
import { useGetPageNameClientSide } from '@src/utils'
import { useIsAdmin } from '@src/hooks/useIsAdmin'
import type { RoutesMetaConfig } from '@src/types/routes'

import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
// import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  Icon,
  IconName,
  IconSize,
  IconPosition,
  // IconStatus,
  // StatusIcon
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title'
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text'
import { default as flexStyles } from '@flex-design-system/framework'
import { default as stylesPage } from '@src/styles/scss/pages/navbar.module.scss'
import { default as stylesLayout } from '@src/styles/scss/pages/layout.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

const NavbarApp = ({mobileCheck} : {mobileCheck: boolean} ) => {
  const [activeDropdown, setActiveDropdown] = React.useState<boolean>(false)
  const pageName = useGetPageNameClientSide()
  const isAdmin = useIsAdmin()

  return (
    <div className={classNames(stylesPage.navBar, flexStyles.navBarHolder)}>
      <div className={flexStyles.navBarLogo}>
        <LogoAPE isNavLogo={true} className={classNames(stylesLayout.navLogo, stylesLayout.navLogoLeft, stylesLayout.navLogoApe)} />
        {/* <Title level={7} className={flexStyles.isMarginless}>Test text</Title> */}
      </div>
      {/* <div className={classNames(
          flexStyles.navBarMenuIcon,
          flexStyles.isHiddenMenuIconTablet
        )}
        onClick={() => {
          setActiveDropdown(!activeDropdown)
        }}>
        <Button level={7}>
          {activeDropdown ? `\u2BC5`: `\u2BC6`}
        </Button>
      </div> */}
      <div className={classNames(
          flexStyles.navBarMenuButton,
          flexStyles.isHiddenMenuIconTablet
        )}>
          <Button
            small
            className={classNames(flexStyles.isOutlined)}
            markup={ButtonMarkup.BUTTON}
            onClick={(e) => {
              ;(e as React.MouseEvent<HTMLButtonElement, MouseEvent>).stopPropagation()
              setActiveDropdown(!activeDropdown)
            }}
          >
            <div className={classNames('w-full flex flex-row justify-center items-center')}>
              <Title level={TitleLevel.LEVEL6} className={classNames('my-0 ml-0 mr-4')}>
                Navigation
              </Title>
              <Icon
                size={IconSize.SMALL}
                position={IconPosition.LEFT}
                name={IconName.UI_ARROW_DOWN}
                className={classNames(activeDropdown ? 'rotate-180' : 'rotate-none')}
              />
            </div>
          </Button>
      </div>
      <div className={classNames(
        flexStyles.navBarOptions,
        !activeDropdown && flexStyles.isHiddenMenuIconMobile,
      )}>
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
                  <span style={{ height: '1.75rem'}} className={classNames(flexStyles.isHiddenMobile, flexStyles.isHiddenMenuIconTabletToDesktop)}>{'\u00A0 > \u00A0'}</span>
                )}
                <Link href={href} className={classNames(flexStyles.link)}>{value.navTitle}</Link>
              </span>
            )
          })
        }
      </div>
    </div>
  )
}

export default NavbarApp
