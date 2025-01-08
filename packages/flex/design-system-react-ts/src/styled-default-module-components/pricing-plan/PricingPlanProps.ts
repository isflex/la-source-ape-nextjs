import { GenericChildren } from '../../generics/index.js'

/**
 * Pricing Plan Interface
 */
export interface PricingPlanProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Web Interface
 */
export interface PricingPlanWebProps extends PricingPlanProps {
  className?: string
  classList?: string[]
}
