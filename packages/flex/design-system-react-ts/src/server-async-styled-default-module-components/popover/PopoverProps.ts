import { PopoverArrowPosition, PopoverDirection } from './PopoverEnum.js'
import { GenericChildren } from '../../generics/index.js'

/**
 * Popover Interface
 */
export interface PopoverProps {
  children?: GenericChildren | string
  direction?: PopoverDirection
  active?: boolean
  content?: React.ReactNode
  arrowPosition?: PopoverArrowPosition
}

/**
 * Popover Web Interface
 */
export interface PopoverWebProps extends PopoverProps {
  className?: string
  classList?: string[]
}
