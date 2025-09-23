import { ColumnsSize } from '../../columns/ColumnsTypes.js'
import { type GenericChildren } from '../../../generics/index.js'

export interface InfoBlockContentProps {
  children?: GenericChildren | string
  size?: ColumnsSize
  className?: string
  classList?: string[]
}
