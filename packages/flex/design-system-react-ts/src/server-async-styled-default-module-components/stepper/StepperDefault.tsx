// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { has, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { StepperProps } from './StepperProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Stepper Component
 * @param className Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param centered Center the stepper
 */
const Stepper = async ({ className, classList, centered, ...others }: StepperProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.stepper, className, validate(classList))

  const centerClasses = classNames(styles.section, styles[camelCase(has('text-centered')) as keyof Styles], className)

  if (centered) {
    return (
      <section className={centerClasses}>
        <div className={classes} {...others} />
      </section>
    )
  }

  return <div className={classes} {...others} />
}

export default Stepper
