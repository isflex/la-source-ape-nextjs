import { ColumnsSize } from './ColumnsTypes.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Columns Interface
 */
export interface ColumnsProps {
  children?: GenericChildren | string
  multiline?: boolean
  centered?: boolean
  gapless?: boolean
  marginSize?: ColumnsSize
  verticalCentered?: boolean
  className?: string
  classList?: string[]
  mobile?: boolean
  flex?: boolean
}
