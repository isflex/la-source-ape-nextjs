import { GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Dropdown Interface
 */
export interface NavbarDropdownProps {
  children?: GenericChildren | string
}

/**
 * Navbar Dropdown Web Interface
 */
export interface NavbarDropdownWebProps extends NavbarDropdownProps {
  className?: string
  classList?: string[]
}
