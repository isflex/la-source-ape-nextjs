/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { Link } from '../../link/index.js'
import { MenuItemWebProps } from './MenuItemProps.js'
// import { Route, BrowserRouter } from 'react-router-dom'
// import { BrowserRouter } from 'react-router-dom'
// import { FlexBrowserRouter } from '@flexiness/domain-lib-flex-browser-router'
import { Badge } from '../../badge/index.js'
import { Icon } from '../../icon/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

// accessibility
const a11y = { role: 'menuitem' }

/**
 * Menu Item Component - Menu Item component
 * @param children {ReactNode} Children for Menu Item
 * @param className {string} Additionnal CSS Classes
 * @param to {string} Link
 * @param arrow {boolean} Add arrow for MenuItem
 * @param badge {string|number} Add custom Badge
 * @param icon {IconName} Add custom Icon
 * @param onClick {Function} onClick Event for Menu Item
 */

type children = true | React.ReactNode | React.ReactPortal
type child = React.ReactNode | React.ReactPortal

const MenuItem = async ({
  active,
  children,
  className,
  classList,
  to,
  arrow,
  badge,
  icon,
  onClick,
  ...others
}: MenuItemWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    'menu-item',
    active && styles[camelCase(is('active')) as keyof Styles],
    arrow && styles.withArrow,
    className,
    validate(classList),
  )

  if (!children) {
    return <div />
  }
  return (
    // <BrowserRouter>
    <li {...a11y} onClick={onClick && onClick}>
      {React.Children.toArray(children as children).map((child: child, i: number) => {
        const item: React.ReactNode = (
          <>
            {icon && <Icon name={icon} />}
            {child}
            {badge && <Badge>{badge}</Badge>}
          </>
        )

        return (
          (child && typeof child.valueOf() === 'string' && (
            <Link key={i} className={classes} {...others} to={to} removeLinkClass>
              <span>{item}</span>
            </Link>
          )) || <React.Fragment key={i}>{item}</React.Fragment>
        )
      })}
    </li>
    //   <Route path='/' />
    // </BrowserRouter>
  )
}

export default MenuItem
