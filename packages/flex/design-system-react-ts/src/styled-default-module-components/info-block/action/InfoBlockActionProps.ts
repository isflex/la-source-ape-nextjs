import { ClickEvent } from '../../../events/index.js'
import { GenericChildren } from '../../../generics/index.js'

export interface InfoBlockActionProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  onClick?: ClickEvent
}
