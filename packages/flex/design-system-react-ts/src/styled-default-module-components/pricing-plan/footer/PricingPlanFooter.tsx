import React from 'react'
import classNames from 'classnames'
import { PricingPlanFooterWebProps } from './PricingPlanFooterProps.js'

/**
 * Pricing Plan Footer Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanFooter = ({ className, ...others }: PricingPlanFooterWebProps): React.JSX.Element => {
  const classes = classNames('plan-footer', className)

  return <div className={classes} {...others} />
}

export default PricingPlanFooter
