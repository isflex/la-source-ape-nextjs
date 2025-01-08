import { HiddenTouch } from '../../../objects/facets/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Extras Interface
 */
export interface NavbarExtrasProps extends HiddenTouch {
  children?: GenericChildren | string
}

/**
 * Navbar Extras Web Interface
 */
export interface NavbarExtrasWebProps extends NavbarExtrasProps {
  className?: string
  classList?: string[]
}
