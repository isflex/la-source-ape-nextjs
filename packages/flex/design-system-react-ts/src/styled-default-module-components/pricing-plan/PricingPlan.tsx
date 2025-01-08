import React from 'react'
import classNames from 'classnames'
import { PricingPlanWebProps } from './PricingPlanProps.js'

/**
 * Pricing Plan Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlan = ({ className, ...others }: PricingPlanWebProps): React.JSX.Element => {
  const classes = classNames('pricing-plan', className)

  return <div className={classes} {...others} />
}

export default PricingPlan
