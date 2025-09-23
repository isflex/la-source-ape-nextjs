import { type GenericChildren } from '../../../generics/index.js'

/**
 * Breadcrumb Item Interface
 */
export interface BreadcrumbItemProps {
  children?: GenericChildren | string
  active?: boolean
  href?: string
}

/**
 * Breadcrumb Item Web Interface
 */
export interface BreadcrumbItemWebProps extends BreadcrumbItemProps {
  className?: string
  classList?: string[]
}
