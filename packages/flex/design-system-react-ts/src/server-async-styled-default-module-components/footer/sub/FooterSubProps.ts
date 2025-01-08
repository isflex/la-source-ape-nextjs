import { GenericChildren } from '../../../generics/index.js'

/**
 * Footer Sub Interface
 */
export interface FooterSubProps {
  children?: GenericChildren | string
}

/**
 * Footer Sub Web Interface
 */
export interface FooterSubWebProps extends FooterSubProps {
  className?: string
  classList?: string[]
}
