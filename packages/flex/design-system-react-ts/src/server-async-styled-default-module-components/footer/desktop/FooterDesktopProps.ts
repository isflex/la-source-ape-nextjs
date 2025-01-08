import { Fullwidth } from '../../../objects/facets/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Footer Desktop Interface
 */
export interface FooterDesktopProps extends Fullwidth {
  children?: GenericChildren | string
}

/**
 * Footer Desktop Web Interface
 */
export interface FooterDesktopWebProps extends FooterDesktopProps {
  className?: string
  classList?: string[]
}
