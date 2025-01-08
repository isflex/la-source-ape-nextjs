import { Marginless } from '../../objects/facets/index.js'

// import { GenericChildren } from '../../generics/index.js'

/**
 * Divider Interface
 */
export interface DividerProps extends Marginless {
  content?: string
  unboxed?: boolean
  className?: string
  classList?: string[]
}
