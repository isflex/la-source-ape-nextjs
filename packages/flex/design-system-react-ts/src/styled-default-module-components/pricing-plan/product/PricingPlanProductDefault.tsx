'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingPlanProductWebProps } from './PricingPlanProductProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Product Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param hat {boolean} Has hat
 */
const PricingPlanProduct = ({ className, classList, hat, ...others }: PricingPlanProductWebProps): React.JSX.Element => {
  const classes = classNames(styles.pricingPlanProduct, hat && styles.hasHat, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlanProduct
