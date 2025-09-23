import { type GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Start Interface
 */
export interface NavbarStartProps {
  children?: GenericChildren | string
}

/**
 * Navbar Start Web Interface
 */
export interface NavbarStartWebProps extends NavbarStartProps {
  className?: string
  classList?: string[]
}
