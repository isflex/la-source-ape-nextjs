import { GenericChildren } from '../../../generics/index.js'

/**
 * Accordion Body Interface
 */
export interface AccordionBodyProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  withAction?: boolean
}
