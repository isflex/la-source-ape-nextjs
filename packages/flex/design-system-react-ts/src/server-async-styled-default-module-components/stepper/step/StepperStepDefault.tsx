// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { StepperStepProps } from './StepperStepProps.js'
import { StepperStepMarkup } from './StepperStepEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Stepper Step Component
 * @param children {ReactNode} Stepper Step Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param active {boolean} Active step
 * @param markup {StepperStepMarkup} Markup for Step - P|SPAN|DIV|A
 * @param current {boolean} Current step
 * @param done {boolean} Step done
 * @param validated {boolean} Step validated
 * @param highlighted {boolean} Step highlighted
 * @param label {string} Step label
 * @param labelTablet {string} Step label tablet
 * @param labelMobile {string} Step label mobile
 * @param step {number|string} Step text circle
 */
const StepperStep = async ({
  children,
  className,
  classList,
  active,
  markup,
  current,
  done,
  label,
  labelTablet,
  labelMobile,
  step,
  validated,
  highlighted,
  ...others
}: StepperStepProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.step,
    active && styles[camelCase(is('active')) as keyof Styles],
    current && styles[camelCase(is('current')) as keyof Styles],
    done && styles[camelCase(is('done')) as keyof Styles],
    validated && styles[camelCase(is('validated')) as keyof Styles],
    highlighted && styles[camelCase(is('highlighted')) as keyof Styles],
    className,
    validate(classList),
  )

  /**
   * If no markup return div
   */
  const Tag = markup && (markup in StepperStepMarkup || Object.values(StepperStepMarkup).includes(markup)) ? markup : StepperStepMarkup.DIV

  return (
    <Tag className={classes} data-label={label} data-label-tablet={labelTablet} data-label-mobile={labelMobile} {...others}>
      {step || children}
    </Tag>
  )
}

export default StepperStep
