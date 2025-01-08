'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarLinksWebProps } from './NavbarLinksProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Links Component
 * @param children {ReactNode} Navbar Links Child
 * @param className {string} Additionnal css classes
 */
const NavbarLinks = ({ className, classList, ...others }: NavbarLinksWebProps): React.JSX.Element => {
  const classes = classNames(styles.navbarLinks, className, validate(classList))

  return <div className={classes} {...others} />
}

export default NavbarLinks
