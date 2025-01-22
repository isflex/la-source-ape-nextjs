'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarStartWebProps } from './NavbarStartProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Start Component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 */
const NavbarStart = async ({ className, classList, ...others }: NavbarStartWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(styles.navbarStart, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarStart
