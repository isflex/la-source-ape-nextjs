import React from 'react'
import classNames from 'classnames'
import { NavbarDropdownWebProps } from './NavbarDropdownProps.js'

/**
 * Navbar Dropdown Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const NavbarDropdown = ({ className, ...others }: NavbarDropdownWebProps): React.JSX.Element => {
  const classes = classNames('navbar-dropdown', className)

  return <div className={classes} {...others} />
}

export default NavbarDropdown
