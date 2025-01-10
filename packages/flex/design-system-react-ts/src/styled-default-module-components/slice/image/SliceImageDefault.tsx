'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SliceImageProps } from './SliceImageProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice Image Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Custom children for Slice Image
 * @param src {string} Image source
 * @param alt {string} Image alt
 * @param rounded {boolean} Rounded Slice Image
 */
const SliceImage = ({ children, className, classList, src, alt, rounded, ...others }: SliceImageProps): React.JSX.Element => {
  const classes = classNames(styles.sliceImage, className, validate(classList))

  if (children) {
    return (
      <div className={classes} {...others}>
        {children}
      </div>
    )
  }

  return (
    <div className={classes} {...others}>
      <div className={styles.image}>
        <img className={(rounded && styles.isRounded) || ''} src={src} alt={alt} />
      </div>
    </div>
  )
}

export default SliceImage
