'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingPlanPriceWebProps } from './PricingPlanPriceProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Price Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanPrice = async ({ className, classList, ...others }: PricingPlanPriceWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.planPrice, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlanPrice
