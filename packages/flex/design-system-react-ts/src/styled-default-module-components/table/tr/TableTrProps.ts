import { type GenericChildren } from '../../../generics/index.js'

export interface TableTrProps {
  children?: GenericChildren | string
  expandable?: boolean
  expanded?: boolean | React.ReactNode | string
  className?: string
  classList?: string[]
}
