import React from 'react'
import classNames from 'classnames'
import { NavbarDividerWebProps } from './NavbarDividerProps.js'

/**
 * Navbar Divider
 * @param children {ReactNode} Navbar Divider Children
 * @param className {string} Additionnal css classes
 */
const NavbarDivider = ({ className, ...others }: NavbarDividerWebProps): React.JSX.Element => {
  const classes = classNames('navbar-brand', className)

  return <div className={classes} {...others} />
}

export default NavbarDivider
