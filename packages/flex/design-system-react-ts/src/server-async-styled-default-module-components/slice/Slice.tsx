'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceProps } from './SliceProps.js'
import { has, is } from '../../services/index.js'

/**
 * Slice Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice
 * @param onClick {Function} onClick Event Slice
 * @param disabled {boolean} Disabled Slice
 * @param longCta {boolean} Change to the CTA line
 * @param selectable {boolean} Apply Field, Control classes wrapped
 */
const Slice = async ({ children, className, onClick, disabled, longCta, selectable, ...others }: SliceProps): Promise<React.ReactNode> => {
  const classes = classNames('slice', disabled && is('disabled'), longCta && has('long-cta'), className)

  if (selectable) {
    return (
      <div onClick={onClick && onClick} className={classes} {...others}>
        <div className='field'>
          <div className='control'>{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClick && onClick} className={classes} {...others}>
      {children}
    </div>
  )
}

export default Slice
