'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarMenuWebProps } from './NavbarMenuProps.js'
import { is } from '../../../services/index'

/**
 * Navbar component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 * @param hiddenTouch {boolean} Display modes only: mobile and desktop; use it to manage the responsive
 */
const NavbarMenu = async ({ className, hiddenTouch, ...others }: NavbarMenuWebProps): Promise<React.ReactNode> => {
  const classes = classNames('navbar-menu', hiddenTouch && is('hidden-touch'), className)

  return <div className={classes} {...others} />
}

export default NavbarMenu
