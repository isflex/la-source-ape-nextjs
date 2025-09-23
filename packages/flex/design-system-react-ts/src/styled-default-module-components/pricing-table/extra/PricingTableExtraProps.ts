import { type GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Table Extra Interface
 */
export interface PricingTableExtraProps {
  children?: GenericChildren | string
}

/**
 * Pricing Table Extra Web Interface
 */
export interface PricingTableExtraWebProps extends PricingTableExtraProps {
  className?: string
  classList?: string[]
}
