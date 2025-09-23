import { BadgeTextDirection } from './BadgeEnum.js'

import { type GenericChildren } from '../../generics/index.js'

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
