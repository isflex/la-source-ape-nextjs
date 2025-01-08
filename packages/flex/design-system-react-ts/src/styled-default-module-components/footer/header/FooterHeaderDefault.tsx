'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterHeaderWebProps } from './FooterHeaderProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const FooterHeader = ({ className, classList, ...others }: FooterHeaderWebProps): React.JSX.Element => {
  const classes = classNames(styles.accordionHeader, className, validate(classList))

  return <div className={classes} {...others} />
}

export default FooterHeader
