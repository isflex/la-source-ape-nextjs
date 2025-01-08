import { Invertable, Small, AlertProps, VariantProps, Hat } from '../../objects/facets/index.js'
import { StickerMarkup } from './StickerEnum.js'
import { GenericChildren } from '../../generics/index.js'

export interface StickerProps extends Small, VariantProps, AlertProps, Hat, Invertable {
  children?: GenericChildren | string
  stretched?: boolean
  className?: string
  classList?: string[]
  markup?: StickerMarkup
}
