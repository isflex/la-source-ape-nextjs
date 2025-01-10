'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SliceCtaProps } from './SliceCtaProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice Cta Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice Cta
 */
const SliceCta = ({ children, className, classList, ...others }: SliceCtaProps): React.JSX.Element => {
  const classes = classNames(styles.sliceCallToAction, className, validate(classList))

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceCta
