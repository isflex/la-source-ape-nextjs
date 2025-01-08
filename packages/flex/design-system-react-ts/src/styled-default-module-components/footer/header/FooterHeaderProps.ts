import { GenericChildren } from '../../../generics/index.js'

/**
 * Footer Header Interface
 */
export interface FooterHeaderProps {
  children?: GenericChildren | string
}

/**
 * Footer Header Web Interface
 */
export interface FooterHeaderWebProps extends FooterHeaderProps {
  className?: string
  classList?: string[]
}
