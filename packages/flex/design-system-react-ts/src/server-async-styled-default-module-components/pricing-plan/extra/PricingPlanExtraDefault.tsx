'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingPlanExtraWebProps } from './PricingPlanExtraProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Extra Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanExtra = async ({ className, classList, ...others }: PricingPlanExtraWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.pricingPlanExtra, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlanExtra
