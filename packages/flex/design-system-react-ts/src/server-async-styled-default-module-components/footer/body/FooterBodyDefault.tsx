// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterBodyWebProps } from './FooterBodyProps.js'

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
const FooterHeader = async ({ children, className, classList, ...others }: FooterBodyWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.accordionBody, className, validate(classList))

  const classesContent = classNames(styles.accordionContent)

  return (
    <div className={classes} {...others}>
      <div className={classesContent}>{children}</div>
    </div>
  )
}

export default FooterHeader
