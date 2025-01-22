'use server'

import React from 'react'
import classNames from 'classnames'
import { FooterHeaderWebProps } from './FooterHeaderProps.js'

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 */
const FooterHeader = async ({ className, ...others }: FooterHeaderWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('accordion-header', className)

  return <div className={classes} {...others} />
}

export default FooterHeader
