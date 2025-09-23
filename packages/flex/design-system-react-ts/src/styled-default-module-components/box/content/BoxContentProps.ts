import { type GenericChildren } from '../../../generics/index.js'

/**
 * Box Content Interface
 */
export interface BoxContentProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
}
