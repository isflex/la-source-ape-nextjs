'use server'

import React from 'react'
import classNames from 'classnames'
import { PricingPlanWebProps } from './PricingPlanProps.js'

/**
 * Pricing Plan Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlan = async ({ className, ...others }: PricingPlanWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('pricing-plan', className)

  return <div className={classes} {...others} />
}

export default PricingPlan
