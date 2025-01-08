import { GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Extra Interface
 */
export interface PricingPlanExtraProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Extra Web Interface
 */
export interface PricingPlanExtraWebProps extends PricingPlanExtraProps {
  className?: string
  classList?: string[]
}
