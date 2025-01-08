import React from 'react'
import classNames from 'classnames'
import { PricingPlanPriceWebProps } from './PricingPlanPriceProps.js'

/**
 * Pricing Plan Price Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanPrice = ({ className, ...others }: PricingPlanPriceWebProps): React.JSX.Element => {
  const classes = classNames('plan-price', className)

  return <div className={classes} {...others} />
}

export default PricingPlanPrice
