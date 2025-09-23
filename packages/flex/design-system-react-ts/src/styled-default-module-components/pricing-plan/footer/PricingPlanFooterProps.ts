import { type GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Footer Interface
 */
export interface PricingPlanFooterProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Footer Web Interface
 */
export interface PricingPlanFooterWebProps extends PricingPlanFooterProps {
  className?: string
  classList?: string[]
}
