import { type GenericChildren } from '../../generics/index.js'

/**
 * Dropdown Interface
 */
export interface DropdownProps {
  children?: GenericChildren | string
  active?: boolean
}

/**
 * Dropdown Web Interface
 */
export interface DropdownWebProps extends DropdownProps {
  className?: string
  classList?: string[]
}
