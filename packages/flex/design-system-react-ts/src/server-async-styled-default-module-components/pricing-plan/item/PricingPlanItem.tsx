'use server'

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
const PricingPlanItems = async ({ className, spacing, narrow, ...others }: PricingPlanItemWebProps): Promise<React.ReactNode> => {
  const classes = classNames('plan-item', spacing && is(`${spacing}`), narrow && is('narrow'), className)

  return <div className={classes} {...others} />
}

export default PricingPlanItems
