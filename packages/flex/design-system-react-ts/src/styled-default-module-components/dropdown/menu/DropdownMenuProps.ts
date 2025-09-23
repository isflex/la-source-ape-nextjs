import { type GenericChildren } from '../../../generics/index.js'

/**
 * Dropdown Menu Interface
 */
export interface DropdownMenuProps {
  children?: GenericChildren | string
}

/**
 * Dropdown Menu Web Interface
 */
export interface DropdownMenuWebProps extends DropdownMenuProps {
  className?: string
  classList?: string[]
}
