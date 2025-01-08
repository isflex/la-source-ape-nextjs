import { StepperStepMarkup } from './StepperStepEnum.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Stepper Step Interface
 */
export interface StepperStepProps {
  children?: GenericChildren | string
  active?: boolean
  current?: boolean
  done?: boolean
  validated?: boolean
  highlighted?: boolean
  label?: string
  labelTablet?: string
  labelMobile?: string
  step?: number | string
  className?: string
  classList?: string[]
  markup?: StepperStepMarkup
}
