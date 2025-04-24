'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { NavbarDropdownSectionWebProps } from './NavbarDropdownSectionProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Dropdown Section Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param extras {boolean} Adding extras content
 */
const NavbarDropdownSection = async ({ className, classList, extras, ...others }: NavbarDropdownSectionWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.navbarDropdownSection, extras && is('extras'), className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarDropdownSection
