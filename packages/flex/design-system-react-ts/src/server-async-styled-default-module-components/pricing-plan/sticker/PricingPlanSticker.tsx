'use server'

import React from 'react'
import classNames from 'classnames'
import { PricingPlanStickerWebProps } from './PricingPlanStickerProps.js'

/**
 * Pricing Plan Sticker Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanSticker = async ({ className, ...others }: PricingPlanStickerWebProps): Promise<React.ReactNode> => {
  const classes = classNames('plan-sticker', className)

  return <div className={classes} {...others} />
}

export default PricingPlanSticker
