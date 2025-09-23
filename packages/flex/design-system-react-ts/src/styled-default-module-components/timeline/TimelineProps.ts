import { type GenericChildren } from '../../generics/index.js'

/**
 * Timeline Interface
 */
export interface TimelineProps {
  children?: GenericChildren | string
  notifications?: boolean
}

/**
 * Timeline Web Interface
 */
export interface TimelineWebProps extends TimelineProps {
  className?: string
  classList?: string[]
}
