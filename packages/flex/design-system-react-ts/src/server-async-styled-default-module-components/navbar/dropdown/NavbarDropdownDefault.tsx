// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarDropdownWebProps } from './NavbarDropdownProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Dropdown Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const NavbarDropdown = async ({ className, classList, ...others }: NavbarDropdownWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.navbarDropdown, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarDropdown
