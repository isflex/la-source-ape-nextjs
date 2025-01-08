import { GenericChildren } from '../../../generics/index.js'

/**
 * AccordionAction Interface
 */
export interface AccordionActionProps {
  id?: string
  // children?: React.ReactNode | undefined
  children?: GenericChildren | string
  className?: string
  classList?: string[]
}
