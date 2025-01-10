'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { PricingTableExtraWebProps } from './PricingTableExtraProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Table Extra Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 */
const PricingTableExtra = ({ className, classList, ...others }: PricingTableExtraWebProps): React.JSX.Element => {
  const classes = classNames(styles.pricingTableExtra, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingTableExtra