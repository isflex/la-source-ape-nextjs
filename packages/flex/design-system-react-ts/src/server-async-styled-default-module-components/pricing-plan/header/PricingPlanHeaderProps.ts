import { BackgroundProps } from '../../../objects/atoms/index.js'

import { type GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Header Interface
 */
export interface PricingPlanHeaderProps extends BackgroundProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Header Web Interface
 */
export interface PricingPlanHeaderWebProps extends PricingPlanHeaderProps {
  className?: string
  classList?: string[]
}
