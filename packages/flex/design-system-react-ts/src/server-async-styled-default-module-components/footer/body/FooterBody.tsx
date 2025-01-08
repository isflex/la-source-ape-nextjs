// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { FooterBodyWebProps } from './FooterBodyProps.js'

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 */
const FooterHeader = async ({ children, className, ...others }: FooterBodyWebProps): Promise<React.JSX.Element> => {
  const classes = classNames('accordion-body', className)

  const classesContent = classNames('accordion-content')

  return (
    <div className={classes} {...others}>
      <div className={classesContent}>{children}</div>
    </div>
  )
}

export default FooterHeader
