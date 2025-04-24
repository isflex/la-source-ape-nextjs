'use server'

import React from 'react'
import classNames from 'classnames'
import { FooterSubWebProps } from './FooterSubProps.js'
import { is } from '../../../services/index.js'

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 */
const FooterSub = async ({ children, className, ...others }: FooterSubWebProps): Promise<React.ReactNode> => {
  const classes = classNames(is('footer-sub'), className)

  return (
    <div className={classes} {...others}>
      <div>{children}</div>
    </div>
  )
}

export default FooterSub
