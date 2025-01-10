'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { PricingTableWebProps } from './PricingTableProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Pricing Table Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 * @param special {boolean} New offers Pricing Table
 */
const PricingTable = ({ className, classList, special, ...others }: PricingTableWebProps): React.JSX.Element => {
  const classes = classNames(styles.pricingTable, special && styles.isSpecial, className, validate(classList))

  return <div className={classes} {...others} />
}

export default PricingTable
