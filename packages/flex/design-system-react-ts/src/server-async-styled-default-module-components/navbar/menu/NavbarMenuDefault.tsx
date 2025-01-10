// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarMenuWebProps } from './NavbarMenuProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 * @param hiddenTouch {boolean} Display modes only: mobile and desktop; use it to manage the responsive
 */
const NavbarMenu = async ({ className, classList, hiddenTouch, ...others }: NavbarMenuWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.navbarMenu, hiddenTouch && styles.isHiddenTouch, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarMenu
