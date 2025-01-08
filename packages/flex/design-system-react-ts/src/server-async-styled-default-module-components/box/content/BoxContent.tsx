// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { BoxContentProps } from './BoxContentProps.js'

/**
 * Box Content
 * @param children {ReactNode} Box Content Children
 * @param className {string} Additionnal CSS Classes
 */
const BoxContent = async ({ children, className, ...others }: BoxContentProps): Promise<React.JSX.Element> => {
  return (
    <div className={classNames('box-content', className)} {...others}>
      {children}
    </div>
  )
}

export default BoxContent
