import { Loadable } from '../../objects/facets/index.js'
import { GenericChildren, Styles } from '../../generics/index.js'

/**
 * View Interface
 */
export interface ViewProps extends Loadable {
  // children?: React.ReactNode | undefined
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  style?: Styles
  theme?: 'light' | 'dark'
}
