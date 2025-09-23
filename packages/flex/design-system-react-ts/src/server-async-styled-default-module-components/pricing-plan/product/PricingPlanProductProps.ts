import { Hat } from '../../../objects/facets/index.js'

import { type GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Product Interface
 */
export interface PricingPlanProductProps extends Hat {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Product Web Interface
 */
export interface PricingPlanProductWebProps extends PricingPlanProductProps {
  className?: string
  classList?: string[]
}
