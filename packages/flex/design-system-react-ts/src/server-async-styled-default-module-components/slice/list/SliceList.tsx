'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceListProps } from './SliceListProps.js'
import { is } from '../../../services/index.js'

/**
 * Slice List Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for SliceList (Slice)
 * @param transparent {boolean} Apply transparent on Slices container
 * @param selectable {boolean} List of checkable Slice
 */
const SliceList = async ({ children, className, transparent, selectable, ...others }: SliceListProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('slices', transparent && is('transparent'), selectable && 'slice-select', className)

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceList
