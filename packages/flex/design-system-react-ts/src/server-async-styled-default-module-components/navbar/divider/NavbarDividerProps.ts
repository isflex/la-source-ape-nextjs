import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Divider Interface
 */
export interface NavbarDividerProps {
  children?: GenericChildren | string
}

/**
 * Navbar Divider Web Interface
 */
export interface NavbarDividerWebProps extends NavbarDividerProps {
  className?: string
  classList?: string[]
}
