import { ColumnsSize } from '../ColumnsTypes.js'

import { type GenericChildren } from '../../../generics/index.js'

/**
 * Columns Item Interface
 */
export interface ColumnsItemProps {
  children?: GenericChildren | string
  size?: ColumnsSize
  mobileSize?: ColumnsSize
  tabletSize?: ColumnsSize
  desktopSize?: ColumnsSize
  narrow?: boolean
  className?: string
  classList?: string[]
}
