'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { SliceProps } from './SliceProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Slice
 * @param onClick {Function} onClick Event Slice
 * @param disabled {boolean} Disabled Slice
 * @param longCta {boolean} Change to the CTA line
 * @param selectable {boolean} Apply Field, Control classes wrapped
 */
const Slice = async ({
  children,
  className,
  classList,
  onClick,
  disabled,
  longCta,
  selectable,
  ...others
}: SliceProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(styles.slice, disabled && styles.isDisabled, longCta && styles.hasLongCta, className, validate(classList))

  if (selectable) {
    return (
      <div onClick={onClick && onClick} className={classes} {...others}>
        <div className={styles.field}>
          <div className={styles.control}>{children}</div>
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
