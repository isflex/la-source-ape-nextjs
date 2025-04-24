'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarDividerWebProps } from './NavbarDividerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Divider
 * @param children {ReactNode} Navbar Divider Children
 * @param className {string} Additionnal css classes
 */
const NavbarDivider = async ({ className, classList, ...others }: NavbarDividerWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.navbarBrand, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarDivider
