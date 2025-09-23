import { TagVariant } from './TagEnum.js'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type TagClickEventHandler = React.MouseEvent<Element> | unknown
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type TagMouseEnterEventHandler = React.SyntheticEvent<Element> | unknown
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type TagMouseLeaveEventHandler = React.SyntheticEvent<Element> | unknown

export interface TagClickEvent {
  (e: TagClickEventHandler): void
}

export interface TagMouseEnterEvent {
  (e: TagMouseEnterEventHandler): void
}

export interface TagMouseLeaveEvent {
  (e: TagMouseLeaveEventHandler): void
}

import { type GenericChildren } from '../../generics/index.js'

/**
 * Tag Interface
 */
export interface TagProps {
  children?: GenericChildren | string
  variant?: TagVariant
  deletable?: boolean
  onClick?: TagClickEvent
  onMouseEnter?: TagMouseEnterEvent
  onMouseLeave?: TagMouseLeaveEvent
  hovered?: boolean
  inverted?: boolean
  className?: string
  classList?: string[]
}
