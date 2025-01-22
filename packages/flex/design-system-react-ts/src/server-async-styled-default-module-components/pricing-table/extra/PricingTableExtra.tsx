'use server'

import React from 'react'
import classNames from 'classnames'
import { PricingTableExtraWebProps } from './PricingTableExtraProps.js'

/**
 * Pricing Table Extra Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 */
const PricingTableExtra = async ({ className, ...others }: PricingTableExtraWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('pricing-table-extra', className)

  return <div className={classes} {...others} />
}

export default PricingTableExtra
