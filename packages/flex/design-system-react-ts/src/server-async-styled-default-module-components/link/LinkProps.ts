import { ClickEvent } from '../../events/index.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Link Interface
 */
export interface LinkProps {
  children?: GenericChildren | string
  to?: string
  fixed?: boolean
  plain?: boolean
  tertiary?: boolean
  flexPurple?: boolean
  onClick?: ClickEvent
  className?: string
  classList?: string[]
  removeLinkClass?: boolean
  inverted?: boolean
  title?: string
  href?: string
  target?: string
  rel?: string
}
