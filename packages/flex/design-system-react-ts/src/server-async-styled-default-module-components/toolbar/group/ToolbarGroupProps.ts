import { GenericChildren } from '../../../generics/index.js'

/**
 * Toolbar Group Interface
 */
export interface ToolbarGroupProps {
  children?: GenericChildren | string
  elastic?: boolean
}

/**
 * Toolbar Group Web Interface
 */
export interface ToolbarGroupWebProps extends ToolbarGroupProps {
  className?: string
  classList?: string[]
}
