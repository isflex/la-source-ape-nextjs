'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingPlanStickerWebProps } from './PricingPlanStickerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Sticker Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 */
const PricingPlanSticker = ({ className, classList, ...others }: PricingPlanStickerWebProps): React.JSX.Element => {
  const classes = classNames(styles.planSticker, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingPlanSticker
