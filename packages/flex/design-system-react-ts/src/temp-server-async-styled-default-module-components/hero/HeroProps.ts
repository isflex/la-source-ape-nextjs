import { VariantProps } from '../../objects/facets/index.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Hero Interface
 */
export interface HeroProps extends VariantProps {
  children?: GenericChildren | string
  backgroundSrc?: string
  className?: string
  classList?: string[]
}
