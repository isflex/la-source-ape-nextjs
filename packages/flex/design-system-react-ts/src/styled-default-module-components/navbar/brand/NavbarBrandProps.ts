import { type GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Brand Interface
 */
export interface NavbarBrandProps {
  children?: GenericChildren | string
}

/**
 * Navbar Brand Web Interface
 */
export interface NavbarBrandWebProps extends NavbarBrandProps {
  className?: string
  classList?: string[]
}
