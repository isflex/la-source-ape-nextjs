'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { PricingPlanWebProps } from './PricingPlanProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlan = ({ className, classList, ...others }: PricingPlanWebProps): React.JSX.Element => {
  const classes = classNames(styles.pricingPlan, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlan
