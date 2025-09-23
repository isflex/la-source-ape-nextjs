import { type GenericChildren } from '../../generics/index.js'

/**
 * Container Interface
 */
export interface ContainerProps {
  children?: GenericChildren | string
  fluid?: boolean
  className?: string
  classList?: string[]
}
