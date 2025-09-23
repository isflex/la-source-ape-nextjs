import { Fullwidth } from '../../objects/facets/index.js'
import { type GenericChildren } from '../../generics/index.js'

export interface TableProps extends Fullwidth {
  children?: GenericChildren | string
  bordered?: boolean
  comparative?: boolean
  className?: string
  classList?: string[]
}
