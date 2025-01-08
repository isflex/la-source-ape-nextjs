import React from 'react'
import classNames from 'classnames'
import { PricingPlanProductWebProps } from './PricingPlanProductProps.js'
import { has } from '../../../services/index.js'

/**
 * Pricing Plan Product Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param hat {boolean} Has hat
 */
const PricingPlanProduct = ({ className, hat, ...others }: PricingPlanProductWebProps): React.JSX.Element => {
  const classes = classNames('pricing-plan-product', hat && has('hat'), className)

  return <div className={classes} {...others} />
}

export default PricingPlanProduct
