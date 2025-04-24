'use server'

import React from 'react'
import classNames from 'classnames'
import { PricingPlanItemsWebProps } from './PricingPlanItemsProps.js'
import { has } from '../../../services/index.js'

/**
 * Pricing Plan Items Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param background {BackgroundStyle} Custom background color
 */
const PricingPlanItems = async ({ className, background, ...others }: PricingPlanItemsWebProps): Promise<React.ReactNode> => {
  const classes = classNames('plan-items', background && has(background.getClassName()), className)

  return <div className={classes} {...others} />
}

export default PricingPlanItems
