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
const NavbarMenu = ({ className, hiddenTouch, ...others }: NavbarMenuWebProps): React.JSX.Element => {
  const classes = classNames('navbar-menu', hiddenTouch && is('hidden-touch'), className)

  return <div className={classes} {...others} />
}

export default NavbarMenu
