// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SliceContentProps } from './SliceContentProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice Content Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice Content
 */
const SliceContent = async ({ children, className, classList, ...others }: SliceContentProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.sliceContent, className, validate(classList))

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceContent
