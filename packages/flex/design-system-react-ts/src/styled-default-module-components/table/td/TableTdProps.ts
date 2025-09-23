import { type GenericChildren } from '../../../generics/index.js'

export interface TableTdProps {
  children?: GenericChildren | string
  rowSpan?: number
  colSpan?: number
  className?: string
  classList?: string[]
}
