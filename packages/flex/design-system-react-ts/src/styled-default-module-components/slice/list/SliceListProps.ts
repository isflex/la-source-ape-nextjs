import { GenericChildren } from '../../../generics/index.js'

export interface SliceListProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  transparent?: boolean
  selectable?: boolean
}
