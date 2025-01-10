'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { FooterWebProps } from './FooterProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Component
 * @param children {ReactNode} Footer Children
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param fullwidth {boolean} Footer fullwidth
 */
const Footer = ({ children, className, classList, fullwidth, ...others }: FooterWebProps): React.JSX.Element => {
  const classes = classNames(fullwidth && styles.isFullwidth, className, validate(classList))

  return (
    <footer className={classes} {...others}>
      <div className={styles.footer}>{children}</div>
    </footer>
  )
}

export default Footer
