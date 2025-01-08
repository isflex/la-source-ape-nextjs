import React from 'react'
import classNames from 'classnames'
import { FooterMobileWebProps } from './FooterMobileProps.js'
import { is } from '../../../services/index.js'

/**
 * Footer Mobile Component
 * @param children {ReactNode} Mobile Footer Children
 * @param className {string} Additionnal CSS Classes
 */
const FooterMobile = ({ children, className, ...others }: FooterMobileWebProps): React.JSX.Element => {
  const classes = classNames(is('footer-mobile'), is('hidden-desktop'), className)

  // Mobile Footer
  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default FooterMobile
