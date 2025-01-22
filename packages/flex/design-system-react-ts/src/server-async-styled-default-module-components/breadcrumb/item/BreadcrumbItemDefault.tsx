'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { Text, TextMarkup } from '../../text/index.js'
import { BreadcrumbItemWebProps } from './BreadcrumbItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Breadcrumb Item Component
 * @param children {string} Breadcrumb Item Text
 * @param active {boolean} Active link
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param href {string} Url
 */
const BreadcrumbItem = async ({ children, active, className, classList, ...others }: BreadcrumbItemWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(active && styles[camelCase(is('active')) as keyof Styles], className, validate(classList))

  return (
    <li className={classes}>
      <Text markup={TextMarkup.A} {...others}>
        {children}
      </Text>
    </li>
  )
}

export default BreadcrumbItem
