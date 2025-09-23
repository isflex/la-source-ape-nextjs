import { type GenericChildren } from '../../../generics/index.js'

/**
 * Toolbar Item Interface
 */
export interface ToolbarItemProps {
  children?: GenericChildren | string
  clippedToBottom?: boolean
}

/**
 * Toolbar Item Web Interface
 */
export interface ToolbarItemWebProps extends ToolbarItemProps {
  className?: string
  classList?: string[]
}
