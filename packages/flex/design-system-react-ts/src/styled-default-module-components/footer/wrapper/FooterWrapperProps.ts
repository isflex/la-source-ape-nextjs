import { type GenericChildren } from '../../../generics/index.js'

/**
 * Footer Wrapper Interface
 */
export interface FooterWrapperProps {
  children?: GenericChildren | string
}

/**
 * Footer Wrapper Web Interface
 */
export interface FooterWrapperWebProps extends FooterWrapperProps {
  className?: string
  classList?: string[]
}
