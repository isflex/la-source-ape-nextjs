import { type GenericChildren } from '../../generics/index.js'

/**
 * Breadcrumb Interface
 */
export interface BreadcrumbProps {
  children?: GenericChildren | string
}

/**
 * Breadcrumb Web Interface
 */
export interface BreadcrumbWebProps extends BreadcrumbProps {
  className?: string
  classList?: string[]
}
