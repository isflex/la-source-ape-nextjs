import React from 'react'
import classNames from 'classnames'
import { FooterWrapperWebProps } from './FooterWrapperProps.js'
import { is } from '../../../services/index.js'

/**
 * Footer Wrapper Component - Article for Header & Body
 * @param children {ReactNode} Children for Subfooter
 * @param className {string} Additionnal CSS Classes
 */
const FooterWrapper = ({ className, ...others }: FooterWrapperWebProps): React.JSX.Element => {
  const classes = classNames('accordion', is('active'), className)

  return <article className={classes} {...others} />
}

export default FooterWrapper
