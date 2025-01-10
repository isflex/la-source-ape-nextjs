'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarBrandWebProps } from './NavbarBrandProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Brand Component - Bouygues Logo
 * @param children {ReactNode} Navbar Brand Children
 * @param className {string} Additionnal css classes
 */
const NavbarBrand = ({ className, classList, ...others }: NavbarBrandWebProps): React.JSX.Element => {
  const classes = classNames(styles.navbarBrand, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarBrand
