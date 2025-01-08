import { GenericChildren } from '../../../generics/index.js'

/**
 * Timeline Item Interface
 */
export interface TimelineItemProps {
  children?: GenericChildren | string
  active?: boolean
}

/**
 * Timeline Item Web Interface
 */
export interface TimelineItemWebProps extends TimelineItemProps {
  className?: string
  classList?: string[]
}
