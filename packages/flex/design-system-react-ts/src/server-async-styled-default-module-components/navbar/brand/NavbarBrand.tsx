// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarBrandWebProps } from './NavbarBrandProps.js'

/**
 * Navbar Brand Component - Bouygues Logo
 * @param children {ReactNode} Navbar Brand Children
 * @param className {string} Additionnal css classes
 */
const NavbarBrand = async ({ className, ...others }: NavbarBrandWebProps): Promise<React.JSX.Element> => {
  const classes = classNames('navbar-brand', className)

  return <div className={classes} {...others} />
}

export default NavbarBrand
