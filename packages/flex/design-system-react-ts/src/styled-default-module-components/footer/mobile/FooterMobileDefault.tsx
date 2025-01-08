'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterMobileWebProps } from './FooterMobileProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Mobile Component
 * @param children {ReactNode} Mobile Footer Children
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const FooterMobile = ({ children, className, classList, ...others }: FooterMobileWebProps): React.JSX.Element => {
  const classes = classNames(styles.isFooterMobile, styles.isHiddenDesktop, className, validate(classList))

  // Mobile Footer
  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default FooterMobile
