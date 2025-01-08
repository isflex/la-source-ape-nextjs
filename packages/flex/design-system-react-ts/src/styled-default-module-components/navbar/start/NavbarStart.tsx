import React from 'react'
import classNames from 'classnames'
import { NavbarStartWebProps } from './NavbarStartProps.js'

/**
 * Navbar Start Component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 */
const NavbarStart = ({ className, ...others }: NavbarStartWebProps): React.JSX.Element => {
  const classes = classNames('navbar-start', className)

  return <div className={classes} {...others} />
}

export default NavbarStart
