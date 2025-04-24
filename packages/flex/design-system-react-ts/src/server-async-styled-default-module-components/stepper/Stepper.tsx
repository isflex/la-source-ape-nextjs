'use server'

import React from 'react'
import classNames from 'classnames'
import { StepperProps } from './StepperProps.js'
import { has } from '../../services/index.js'

/**
 * Stepper Component
 * @param className Additionnal CSS Classes
 * @param centered Center the stepper
 */
const Stepper = async ({ className, centered, ...others }: StepperProps): Promise<React.ReactNode> => {
  const classes = classNames('stepper', className)

  const centerClasses = classNames('section', has('text-centered'), className)

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
