import { BackgroundProps } from '../../objects/atoms/index.js'
import { type GenericChildren } from '../../generics/index.js'

/**
 * Toolbar Interface
 */
export interface ToolbarProps extends BackgroundProps {
  children?: GenericChildren | string | number
  whiteBackground?: boolean
}

/**
 * Toolbar Web Interface
 */
export interface ToolbarWebProps extends ToolbarProps {
  className?: string
  classList?: string[]
}
