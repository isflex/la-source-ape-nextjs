import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Links Interface
 */
export interface NavbarLinksProps {
  children?: GenericChildren | string
}

/**
 * Navbar Links Web Interface
 */
export interface NavbarLinksWebProps extends NavbarLinksProps {
  className?: string
  classList?: string[]
}
