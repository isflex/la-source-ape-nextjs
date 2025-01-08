import { ClickEvent } from '../../../events/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Tabs Item Interface
 */
export interface TabsItemProps {
  children: GenericChildren
  onClick?: ClickEvent
  active?: boolean
  className?: string
  classList?: string[]
  id?: string
}
