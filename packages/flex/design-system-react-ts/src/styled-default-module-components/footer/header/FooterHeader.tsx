import React from 'react'
import classNames from 'classnames'
import { FooterHeaderWebProps } from './FooterHeaderProps.js'

/**
 * Footer Sub Component - Subfooter
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 */
const FooterHeader = ({ className, ...others }: FooterHeaderWebProps): React.JSX.Element => {
  const classes = classNames('accordion-header', className)

  return <div className={classes} {...others} />
}

export default FooterHeader
