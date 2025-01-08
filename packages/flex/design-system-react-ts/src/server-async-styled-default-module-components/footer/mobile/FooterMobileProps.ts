import { GenericChildren } from '../../../generics/index.js'

/**
 * Footer Mobile Interface
 */
export interface FooterMobileProps {
  children?: GenericChildren | string
}

/**
 * Footer Web Interface
 */
export interface FooterMobileWebProps extends FooterMobileProps {
  className?: string
  classList?: string[]
}
