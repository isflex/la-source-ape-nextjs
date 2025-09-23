import { Fullwidth } from '../../objects/facets/index.js'

import { type GenericChildren } from '../../generics/index.js'

/**
 * Footer Interface
 */
export interface FooterProps extends Fullwidth {
  children?: GenericChildren | string
  desktop?: boolean
  mobile?: boolean
}

/**
 * Footer Web Interface
 */
export interface FooterWebProps extends FooterProps {
  className?: string
  classList?: string[]
}
