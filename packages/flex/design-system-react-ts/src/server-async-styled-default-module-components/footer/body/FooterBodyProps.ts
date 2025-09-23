import { type GenericChildren } from '../../../generics/index.js'

/**
 * Footer Body Interface
 */
export interface FooterBodyProps {
  children?: GenericChildren | string
}

/**
 * Footer Body Web Interface
 */
export interface FooterBodyWebProps extends FooterBodyProps {
  className?: string
  classList?: string[]
}
