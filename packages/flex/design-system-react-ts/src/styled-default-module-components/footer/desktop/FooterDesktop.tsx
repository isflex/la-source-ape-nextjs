import React from 'react'
import classNames from 'classnames'
import { FooterDesktopWebProps } from './FooterDesktopProps.js'
import { is } from '../../../services/index.js'
import { Accordion } from '../../accordion/index.js'

/**
 * Footer Desktop Component
 * @param children {ReactNode} Desktop Footer Children
 * @param className {string} Additionnal CSS Classes
 * @param fullwidth {boolean} Footer fullwidth
 */
const FooterDesktop = ({ children, className, fullwidth, ...others }: FooterDesktopWebProps): React.JSX.Element => {
  const classes = classNames(is('hidden-touch'), is('footer-desktop'), fullwidth && is('fullwidth'), className)

  // Desktop Footer
  return (
    <Accordion className={classes} {...others}>
      {children}
    </Accordion>
  )
}

export default FooterDesktop
