'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { BreadcrumbWebProps } from './BreadcrumbProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Breadcrumb Component
 * @param children {ReactNode} Breadcrumb Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const Breadcrumb = async ({ children, className, classList, ...others }: BreadcrumbWebProps): Promise<React.AwaitedReactNode> => {
  return (
    <nav className={classNames(styles.breadcrumb, className, validate(classList))} aria-label='breadcrumbs' {...others}>
      <ul>{children}</ul>
    </nav>
  )
}

export default Breadcrumb
