import { GenericChildren } from '../../../generics/index.js'

export interface TableThProps {
  children?: GenericChildren | string
  rowSpan?: number
  colSpan?: number
  className?: string
  classList?: string[]
}
