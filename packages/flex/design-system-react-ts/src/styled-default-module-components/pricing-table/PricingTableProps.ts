import { GenericChildren } from '../../generics/index.js'

/**
 * Pricing Table Interface
 */
export interface PricingTableProps {
  children?: GenericChildren | string
  special?: boolean
}

/**
 * Pricing Table Web Interface
 */
export interface PricingTableWebProps extends PricingTableProps {
  className?: string
  classList?: string[]
}
