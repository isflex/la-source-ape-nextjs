// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { StepperStepProps } from './StepperStepProps.js'
import { StepperStepMarkup } from './StepperStepEnum.js'
import { is } from '../../../services/index.js'

/**
 * Stepper Step Component
 * @param children {ReactNode} Stepper Step Children
 * @param className {string} Additionnal CSS Classes
 * @param active {boolean} Active step
 * @param markup {StepperStepMarkup} Markup for Step - P|SPAN|DIV|A
 * @param current {boolean} Current step
 * @param done {boolean} Step done
 * @param label {string} Step label
 * @param step {number|string} Step text circle
 */
const StepperStep = async ({
  children,
  className,
  active,
  markup,
  current,
  done,
  label,
  step,
  ...others
}: StepperStepProps): Promise<React.JSX.Element> => {
  const classes = classNames('step', active && is('active'), current && is('current'), done && is('done'), className)

  /**
   * If no markup return div
   */
  const Tag = markup && (markup in StepperStepMarkup || Object.values(StepperStepMarkup).includes(markup)) ? markup : StepperStepMarkup.DIV

  return (
    <Tag className={classes} data-label={label} {...others}>
      {step || children}
    </Tag>
  )
}

export default StepperStep
