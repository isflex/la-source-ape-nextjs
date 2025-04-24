'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarExtrasWebProps } from './NavbarExtrasProps.js'
import { is } from '../../../services/index.js'

/**
 * Navbar Navbar End Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param hiddenTouch {boolean} Display modes only: mobile and desktop; use it to manage the responsive
 */
const NavbarExtras = async ({ className, hiddenTouch, ...others }: NavbarExtrasWebProps): Promise<React.ReactNode> => {
  const classes = classNames('navbar-extras', hiddenTouch && is('hidden-touch'), className)

  return <div className={classes} {...others} />
}

export default NavbarExtras
