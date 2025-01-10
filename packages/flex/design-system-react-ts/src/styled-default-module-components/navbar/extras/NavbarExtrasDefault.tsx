'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarExtrasWebProps } from './NavbarExtrasProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Navbar End Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param hiddenTouch {boolean} Display modes only: mobile and desktop; use it to manage the responsive
 */
const NavbarExtras = ({ className, classList, hiddenTouch, ...others }: NavbarExtrasWebProps): React.JSX.Element => {
  const classes = classNames(styles.navbarExtras, hiddenTouch && styles.isHiddenTouch, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarExtras
