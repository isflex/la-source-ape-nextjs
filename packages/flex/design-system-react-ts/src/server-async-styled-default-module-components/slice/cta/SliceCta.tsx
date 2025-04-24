'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceCtaProps } from './SliceCtaProps.js'

/**
 * Slice Cta Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice Cta
 */
const SliceCta = async ({ children, className, ...others }: SliceCtaProps): Promise<React.ReactNode> => {
  const classes = classNames('slice-call-to-action', className)

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceCta
