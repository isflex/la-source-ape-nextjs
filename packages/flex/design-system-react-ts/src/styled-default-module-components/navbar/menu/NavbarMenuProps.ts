import { HiddenTouch } from '../../../objects/facets/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Menu Interface
 */
export interface NavbarMenuProps extends HiddenTouch {
  children?: GenericChildren | string
  newNavbar?: boolean
}

/**
 * Navbar Menu Web Interface
 */
export interface NavbarMenuWebProps extends NavbarMenuProps {
  className?: string
  classList?: string[]
}
