// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { PricingPlanWebProps } from './PricingPlanProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlan = async ({ className, classList, ...others }: PricingPlanWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.pricingPlan, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlan
