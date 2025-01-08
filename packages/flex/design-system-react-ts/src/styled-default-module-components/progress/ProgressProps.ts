import { AlertProps, Stacked } from '../../objects/facets/index.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Progress Interface
 */
export interface ProgressProps extends AlertProps, Stacked {
  children?: GenericChildren | string
  percent?: number
  maxPercent?: number
  small?: boolean
  uniqueLegend?: string
  firstExtremLegend?: string
  secondExtremLegend?: string
  className?: string
  classList?: string[]
}
