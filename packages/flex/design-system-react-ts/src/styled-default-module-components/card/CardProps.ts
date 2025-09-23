import { type GenericChildren } from '../../generics/index.js'

/**
 * Card Interface
 */
export interface CardProps {
  children?: GenericChildren | string
  flat?: boolean
  horizontal?: boolean
  floating?: boolean
  skeleton?: boolean
  className?: string
  classList?: string[]
}
