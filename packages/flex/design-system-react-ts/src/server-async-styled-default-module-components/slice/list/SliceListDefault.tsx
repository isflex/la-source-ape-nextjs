// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SliceListProps } from './SliceListProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice List Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for SliceList (Slice)
 * @param transparent {boolean} Apply transparent on Slices container
 * @param selectable {boolean} List of checkable Slice
 */
const SliceList = async ({ children, className, classList, transparent, selectable, ...others }: SliceListProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.slices, transparent && styles.isTransparent, selectable && styles.sliceSelect, className, validate(classList))

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceList
