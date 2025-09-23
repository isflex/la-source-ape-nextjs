import { ButtonMarkup } from './ButtonEnum.js'
import { ClickEvent } from '../../events/index.js'
import { Fullwidth, AlertProps, VariantProps, Loadable, Invertable } from '../../objects/facets/index.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Button Interface
 */
export interface ButtonProps extends Loadable, Invertable, VariantProps, AlertProps, Fullwidth {
  onClick?: ClickEvent
  children?: GenericChildren | string
  disabled?: boolean
  small?: boolean
  markup?: ButtonMarkup
  href?: string
  className?: string
  classList?: string[]
  to?: string
  id?: string
  compact?: boolean
  type?: 'submit'
}
