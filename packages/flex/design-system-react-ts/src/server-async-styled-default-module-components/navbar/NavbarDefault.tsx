// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { NavbarWebProps } from './NavbarProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar component
 * @param children {ReactNode} Navbar child
 * @param className {string} Additionnal css classes
 * @param newNavbar {boolean} Display new header
 * @param npmNavbar {boolean} Display old header
 */
const Navbar = async ({ children, className, classList, newNavbar, npmNavbar, ...others }: NavbarWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.navbar,
    newNavbar && !npmNavbar && styles.isNew,
    npmNavbar && !newNavbar && styles.isNpm,
    className,
    validate(classList),
  )

  return (
    <div aria-label='main navigation' role='navigation' className={classes} {...others}>
      {children}
    </div>
  )
}

export default Navbar
