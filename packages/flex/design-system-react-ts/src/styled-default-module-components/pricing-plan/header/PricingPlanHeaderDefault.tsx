'use client'

import React from 'react'
import classNames from 'classnames'
import { has, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { PricingPlanHeaderWebProps } from './PricingPlanHeaderProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Plan Header Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param background {BackgroundStyle} Custom background color
 */
const PricingPlanHeader = ({ className, classList, background, ...others }: PricingPlanHeaderWebProps): React.JSX.Element => {
  const classes = classNames(
    styles.planHeader,
    background && styles[camelCase(has(background.getClassName())) as keyof Styles],
    className,
    validate(classList),
  )

  return <div className={classes} {...others} />
}

export default PricingPlanHeader
