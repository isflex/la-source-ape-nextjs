import { ClickEvent } from '../../events/index.js'
import { TileMarkup } from './TileEnum.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Tile Interface
 */
export interface TileProps {
  children?: GenericChildren | string
  onClick?: ClickEvent
  child?: boolean
  parent?: boolean
  ancestor?: boolean
  vertical?: boolean
  markup?: TileMarkup
  to?: string
  className?: string
  classList?: string[]
}
