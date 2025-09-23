import { ClickEvent } from '../../events/index.js'
import { type GenericChildren } from '../../generics/index.js'

export interface SliceProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  onClick?: ClickEvent
  disabled?: boolean
  longCta?: boolean
  selectable?: boolean
}
