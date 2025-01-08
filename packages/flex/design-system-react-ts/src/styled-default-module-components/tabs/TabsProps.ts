import { ClickEvent } from '../../events/index.js'
import { Centerable } from '../../objects/facets/index.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Tabs Interface
 */
export interface TabsProps extends Centerable {
  children?: GenericChildren | string
  onClick?: ClickEvent
  disabled?: boolean
  activeIndex?: number
  rightAlign?: boolean
  clipped?: boolean
  fullwidth?: boolean
  className?: string
  classList?: string[]
}
