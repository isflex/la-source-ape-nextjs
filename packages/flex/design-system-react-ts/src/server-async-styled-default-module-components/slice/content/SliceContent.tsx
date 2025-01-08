// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceContentProps } from './SliceContentProps.js'

/**
 * Slice Content Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice Content
 */
const SliceContent = async ({ children, className, ...others }: SliceContentProps): Promise<React.JSX.Element> => {
  const classes = classNames('slice-content', className)

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceContent
