import { Clipped } from '../../objects/facets/index.js'
import { ModalMarkup } from './ModalEnum.js'
import { ClickEvent } from '../../events/index.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Modal Interface
 */
export interface ModalProps extends Clipped {
  children?: GenericChildren | string
  active?: boolean
  title?: string
  content?: string
  className?: string
  classList?: string[]
  triggerContent?: string
  triggerClassNames?: string
  triggerMarkup?: ModalMarkup
  ctaContent?: string
  ctaOnClick?: ClickEvent
  onClose?: ClickEvent
  onOpen?: ClickEvent
}
