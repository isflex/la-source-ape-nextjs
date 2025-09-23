import { type GenericChildren } from '../../../generics/index.js'

/**
 * Slider Step Interface
 */

export interface SliderItemProps {
  children?: GenericChildren | string
  active?: boolean
  className?: string
  classList?: string[]
}
