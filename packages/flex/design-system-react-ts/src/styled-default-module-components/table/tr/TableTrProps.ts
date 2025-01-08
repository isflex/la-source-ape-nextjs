import { GenericChildren } from '../../../generics/index.js'

export interface TableTrProps {
  children?: GenericChildren | string
  expandable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  expanded?: boolean | React.ReactNode | string
  className?: string
  classList?: string[]
}
