import React from 'react'
import classNames from 'classnames'
import { BoxFooterProps } from './BoxFooterProps.js'

/**
 * Box Footer Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children
 */
const BoxFooter = ({ className, children, ...others }: BoxFooterProps): JSX.Element => (
  <div className={classNames('box-footer', className)} {...others}>
    {children}
  </div>
)

export default BoxFooter
