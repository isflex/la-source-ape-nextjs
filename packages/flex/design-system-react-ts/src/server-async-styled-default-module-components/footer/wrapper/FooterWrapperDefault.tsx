// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterWrapperWebProps } from './FooterWrapperProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Wrapper Component - Article for Header & Body
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const FooterWrapper = async ({ className, classList, ...others }: FooterWrapperWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.accordion, styles.isActive, className, validate(classList))

  return <article className={classes} {...others} />
}

export default FooterWrapper
