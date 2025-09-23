import { type GenericChildren } from '../../generics/index.js'

/**
 * Section Interface
 */
export interface SectionProps {
  children?: GenericChildren | string
  skeleton?: boolean
}

/**
 * Section Web Interface
 */
export interface SectionWebProps extends SectionProps {
  className?: string
  classList?: string[]
}
