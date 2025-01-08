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
const NavbarExtras = ({ className, hiddenTouch, ...others }: NavbarExtrasWebProps): React.JSX.Element => {
  const classes = classNames('navbar-extras', hiddenTouch && is('hidden-touch'), className)

  return <div className={classes} {...others} />
}

export default NavbarExtras
