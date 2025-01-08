// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarLinksWebProps } from './NavbarLinksProps.js'

/**
 * Navbar Links Component
 * @param children {ReactNode} Navbar Links Child
 * @param className {string} Additionnal css classes
 */
const NavbarLinks = async ({ className, ...others }: NavbarLinksWebProps): Promise<React.JSX.Element> => {
  const classes = classNames('navbar-links', className)

  return <div className={classes} {...others} />
}

export default NavbarLinks
