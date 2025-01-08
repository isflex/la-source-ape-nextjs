import { ClickEvent } from '../../events/index.js'
import { GenericChildren } from '../../generics/index.js'

export enum BoxMarkup {
  DIV = 'div',
  A = 'a',
}

/**
 * Box Interface
 */
export interface BoxProps {
  children?: GenericChildren | string
  skeleton?: boolean
  className?: string
  classList?: string[]
  onClick?: ClickEvent
  markup?: BoxMarkup
  to?: string
}
