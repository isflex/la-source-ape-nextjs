import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar End Interface
 */
export interface NavbarEndProps {
  children?: GenericChildren | string
}

/**
 * Navbar End Web Interface
 */
export interface NavbarEndWebProps extends NavbarEndProps {
  className?: string
  classList?: string[]
}
