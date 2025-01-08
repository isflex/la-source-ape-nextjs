import { Small, AlertProps, VariantProps, Hat } from '../../objects/facets/index.js'
import { GenericChildren } from '../../generics/index.js'

export interface SliderProps extends Small, VariantProps, AlertProps, Hat {
  children?: GenericChildren | string
  stretched?: boolean
  className?: string
  classList?: string[]
  iconClassName?: string
  motionLess?: boolean
}
