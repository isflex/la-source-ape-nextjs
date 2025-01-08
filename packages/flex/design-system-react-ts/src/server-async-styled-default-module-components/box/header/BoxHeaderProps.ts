import { GenericChildren } from '../../../generics/index.js'

/**
 * Box Header Interface
 */
export interface BoxHeaderProps {
  children?: GenericChildren | string
  help?: string
  className?: string
  classList?: string[]
}
