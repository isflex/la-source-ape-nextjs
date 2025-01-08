import { GenericChildren } from '../../../generics/index.js'

/**
 * AccordionHeader Interface
 */
export interface AccordionHeaderProps {
  id?: string
  // children?: React.ReactNode | undefined
  children?: GenericChildren | string
  toggle?: boolean
  toggleBox?: string
  toggleBoxClass?: string
  className?: string
  classList?: string[]
}
