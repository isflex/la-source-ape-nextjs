'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarDropdownWebProps } from './NavbarDropdownProps.js'

/**
 * Navbar Dropdown Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const NavbarDropdown = async ({ className, ...others }: NavbarDropdownWebProps): Promise<React.ReactNode> => {
  const classes = classNames('navbar-dropdown', className)

  return <div className={classes} {...others} />
}

export default NavbarDropdown
