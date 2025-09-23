import { type GenericChildren } from '../../generics/index.js'

/**
 * Stepper Interface
 */
export interface StepperProps {
  children?: GenericChildren | string
  centered?: boolean
  className?: string
  classList?: string[]
}
