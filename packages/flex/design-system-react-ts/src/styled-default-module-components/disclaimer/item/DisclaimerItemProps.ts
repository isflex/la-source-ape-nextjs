import { type GenericChildren } from '../../../generics/index.js'

/**
 * Disclaimer Item Interface
 */
export interface DisclaimerItemProps {
  children?: GenericChildren | string
}

/**
 * Disclaimer Item Interface
 */
export interface DisclaimerItemWebProps extends DisclaimerItemProps {
  className?: string
  classList?: string[]
}
