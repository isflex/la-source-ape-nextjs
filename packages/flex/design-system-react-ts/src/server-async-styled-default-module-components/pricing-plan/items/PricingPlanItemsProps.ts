import { BackgroundProps } from '../../../objects/atoms/index.js'

import { GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Items Interface
 */
export interface PricingPlanItemsProps extends BackgroundProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Items Web Interface
 */
export interface PricingPlanItemsWebProps extends PricingPlanItemsProps {
  className?: string
  classList?: string[]
}
