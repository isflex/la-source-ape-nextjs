'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { PricingPlanItemWebProps } from './PricingPlanItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Item Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param spacing {SpacingLevel} 1 to 12
 * @param narrow {boolean} Apply narrow
 */
const PricingPlanItems = async ({ className, classList, spacing, narrow, ...others }: PricingPlanItemWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    styles.planItem,
    spacing && styles[camelCase(is(`${spacing}`)) as keyof Styles],
    narrow && styles.isNarrow,
    className,
    validate(classList),
  )

  return <div className={classes} {...others} />
}

export default PricingPlanItems
