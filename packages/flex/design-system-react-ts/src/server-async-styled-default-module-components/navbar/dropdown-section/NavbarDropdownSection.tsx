// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarDropdownSectionWebProps } from './NavbarDropdownSectionProps.js'
import { is } from '../../../services/index.js'

/**
 * Navbar Dropdown Section Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param extras {boolean} Adding extras content
 */
const NavbarDropdownSection = async ({ className, extras, ...others }: NavbarDropdownSectionWebProps): Promise<React.JSX.Element> => {
  const classes = classNames('navbar-dropdown-section', extras && is('extras'), className)

  return <div className={classes} {...others} />
}

export default NavbarDropdownSection
