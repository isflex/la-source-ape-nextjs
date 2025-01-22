'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarWebProps } from './NavbarProps.js'
import { is } from '../../services/index.js'

/**
 * Navbar component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 * @param newNavbar {boolean} Display new header
 * @param npmNavbar {boolean} Display old header
 */
const Navbar = async ({ children, className, newNavbar, npmNavbar, ...others }: NavbarWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('navbar', newNavbar && !npmNavbar && is('new'), npmNavbar && !newNavbar && is('npm'), className)

  return (
    <div aria-label='main navigation' role='navigation' className={classes} {...others}>
      {children}
    </div>
  )
}

export default Navbar
