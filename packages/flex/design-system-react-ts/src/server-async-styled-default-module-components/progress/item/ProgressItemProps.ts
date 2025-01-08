import { AlertProps } from '../../../objects/facets/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Progress Item Interface
 */
export interface ProgressItemProps extends AlertProps {
  children?: GenericChildren | string
  percent: number
  minPercent?: number
  maxPercent?: number
  className?: string
  classList?: string[]
}
