'use server'

import React from 'react'
import classNames from 'classnames'
import { FooterWebProps } from './FooterProps.js'
import { is } from '../../services/index.js'

/**
 * Footer Component
 * @param children {ReactNode} Footer Children
 * @param className {string} Additionnal CSS Classes
 * @param fullwidth {boolean} Footer fullwidth
 */
const Footer = async ({ children, className, fullwidth, ...others }: FooterWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(fullwidth && is('fullwidth'), className)

  return (
    <footer className={classes} {...others}>
      <div className='footer'>{children}</div>
    </footer>
  )
}

export default Footer
