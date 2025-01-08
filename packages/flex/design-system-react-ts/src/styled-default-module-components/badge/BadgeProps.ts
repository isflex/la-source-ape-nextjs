import { BadgeTextDirection } from './BadgeEnum.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Badge Interface
 */
export interface BadgeProps {
  children?: string | number
  content?: string | number
  textContent?: GenericChildren | string
  direction?: BadgeTextDirection
  className?: string
  classList?: string[]
}
