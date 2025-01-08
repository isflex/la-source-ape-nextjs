import { Invertable } from '../../objects/facets/index.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Options Interface
 */
export interface OptionsProps extends Invertable {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
}
