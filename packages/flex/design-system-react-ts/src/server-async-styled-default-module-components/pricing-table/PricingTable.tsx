'use server'

import React from 'react'
import classNames from 'classnames'
import { PricingTableWebProps } from './PricingTableProps.js'
import { is } from '../../services/index.js'

/**
 * Pricing Table Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 * @param special {boolean} New offers Pricing Table
 */
const PricingTable = async ({ className, special, ...others }: PricingTableWebProps): Promise<React.ReactNode> => {
  const classes = classNames('pricing-table', special && is('special'), className)

  return <div className={classes} {...others} />
}

export default PricingTable
