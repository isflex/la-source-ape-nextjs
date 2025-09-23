import { type GenericChildren } from '../../generics/index.js'

/**
 * Accordion Interface
 */
export interface AccordionProps {
  children?: GenericChildren | string
  boxed?: boolean
  className?: string
  classList?: string[]
}
