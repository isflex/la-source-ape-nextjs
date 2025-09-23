import { type GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Price Interface
 */
export interface PricingPlanPriceProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Price Web Interface
 */
export interface PricingPlanPriceWebProps extends PricingPlanPriceProps {
  className?: string
  classList?: string[]
}
