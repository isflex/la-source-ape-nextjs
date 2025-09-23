import { PriceVariant, PriceLevel } from './PriceEnum.js'
import { Invertable } from '../../objects/facets/index.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Price Interface
 */
export interface PriceProps extends Invertable {
  children?: GenericChildren | string
  variant?: PriceVariant
  amount: number
  mention?: string
  period?: string
  showCents?: boolean
  level?: PriceLevel
  huge?: boolean
  className?: string
  classList?: string[]
}
