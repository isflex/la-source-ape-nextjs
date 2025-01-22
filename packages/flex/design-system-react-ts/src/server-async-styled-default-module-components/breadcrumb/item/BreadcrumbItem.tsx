'use server'

import React from 'react'
import classNames from 'classnames'
import { Text, TextMarkup } from '../../text/index.js'
import { BreadcrumbItemWebProps } from './BreadcrumbItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Breadcrumb Item Component
 * @param children {string} Breadcrumb Item Text
 * @param active {boolean} Active link
 * @param className {string} Additionnal CSS Classes
 * @param href {string} Url
 */
const BreadcrumbItem = async ({ children, active, className, ...others }: BreadcrumbItemWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(active && is('active'), className)

  return (
    <li className={classes}>
      <Text markup={TextMarkup.A} {...others}>
        {children}
      </Text>
    </li>
  )
}

export default BreadcrumbItem
