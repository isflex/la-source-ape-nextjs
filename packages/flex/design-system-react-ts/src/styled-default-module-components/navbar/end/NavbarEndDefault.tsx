'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarEndWebProps } from './NavbarEndProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Navbar End Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const NavbarEnd = ({ children, className, classList, ...others }: NavbarEndWebProps): React.JSX.Element => {
  const classes = classNames(styles.navbarEnd, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <div className={styles.navbarIcons}>{children}</div>
    </div>
  )
}

export default NavbarEnd
