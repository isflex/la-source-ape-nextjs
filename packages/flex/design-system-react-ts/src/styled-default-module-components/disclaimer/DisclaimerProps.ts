import { GenericChildren } from '../../generics/index.js'

/**
 * Disclaimer Interface
 */
export interface DisclaimerProps {
  children?: GenericChildren | string
  title?: string
  active?: boolean
}

/**
 * Disclaimer Interface
 */
export interface DisclaimerWebProps extends DisclaimerProps {
  className?: string
  classList?: string[]
}
