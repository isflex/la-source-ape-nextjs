import { GenericChildren } from '../../../generics/index.js'

/**
 * Pricing Plan Sticker Interface
 */
export interface PricingPlanStickerProps {
  children?: GenericChildren | string
}

/**
 * Pricing Plan Sticker Web Interface
 */
export interface PricingPlanStickerWebProps extends PricingPlanStickerProps {
  className?: string
  classList?: string[]
}
