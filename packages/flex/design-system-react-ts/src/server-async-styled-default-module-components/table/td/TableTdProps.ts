import { type GenericChildren, Styles } from '../../../generics/index.js'

export interface TableTdProps {
  children?: GenericChildren | string
  rowSpan?: number
  colSpan?: number
  className?: string
  classList?: string[]
  style?: Styles
}
