import React from 'react'
import classNames from 'classnames'
import { SliceCtaProps } from './SliceCtaProps.js'

/**
 * Slice Cta Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice Cta
 */
const SliceCta = ({ children, className, ...others }: SliceCtaProps): React.JSX.Element => {
  const classes = classNames('slice-call-to-action', className)

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default SliceCta
