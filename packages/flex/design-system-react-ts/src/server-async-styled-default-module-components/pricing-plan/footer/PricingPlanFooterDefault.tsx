'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingPlanFooterWebProps } from './PricingPlanFooterProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Footer Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanFooter = async ({ className, classList, ...others }: PricingPlanFooterWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.planFooter, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlanFooter
