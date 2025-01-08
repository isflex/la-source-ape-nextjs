import React from 'react'
import classNames from 'classnames'
import { PricingPlanItemWebProps } from './PricingPlanItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Pricing Plan Item Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param spacing {SpacingLevel} 1 to 12
 * @param narrow {boolean} Apply narrow
 */
const PricingPlanItems = ({ className, spacing, narrow, ...others }: PricingPlanItemWebProps): React.JSX.Element => {
  const classes = classNames('plan-item', spacing && is(`${spacing}`), narrow && is('narrow'), className)

  return <div className={classes} {...others} />
}

export default PricingPlanItems
