import React from 'react'
import classNames from 'classnames'
import { NavbarEndWebProps } from './NavbarEndProps.js'

/**
 * Navbar Navbar End Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const NavbarEnd = ({ children, className, ...others }: NavbarEndWebProps): React.JSX.Element => {
  const classes = classNames('navbar-end', className)

  return (
    <div className={classes} {...others}>
      <div className='navbar-icons'>{children}</div>
    </div>
  )
}

export default NavbarEnd
