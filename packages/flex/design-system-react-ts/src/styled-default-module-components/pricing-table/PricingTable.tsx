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
const PricingTable = ({ className, special, ...others }: PricingTableWebProps): React.JSX.Element => {
  const classes = classNames('pricing-table', special && is('special'), className)

  return <div className={classes} {...others} />
}

export default PricingTable
