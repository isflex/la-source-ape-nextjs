import React from 'react'
import classNames from 'classnames'
import { PricingTableExtraWebProps } from './PricingTableExtraProps.js'

/**
 * Pricing Table Extra Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 */
const PricingTableExtra = ({ className, ...others }: PricingTableExtraWebProps): React.JSX.Element => {
  const classes = classNames('pricing-table-extra', className)

  return <div className={classes} {...others} />
}

export default PricingTableExtra
