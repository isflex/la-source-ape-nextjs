'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceBodyProps } from './SliceBodyProps.js'
// import { has, is } from '../../services/index.js'

/**
 * Slice Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice
 */
const SliceBody = async ({ children, className, ...others }: SliceBodyProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('slice-body', className)

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceBody
