'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterSubWebProps } from './FooterSubProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const FooterSub = ({ children, className, classList, ...others }: FooterSubWebProps): React.JSX.Element => {
  const classes = classNames(styles.isFooterSub, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <div>{children}</div>
    </div>
  )
}

export default FooterSub
