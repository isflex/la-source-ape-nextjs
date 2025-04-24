'use server'

import React from 'react'
import classNames from 'classnames'
import { BreadcrumbWebProps } from './BreadcrumbProps.js'

/**
 * Breadcrumb Component
 * @param children {ReactNode} Breadcrumb Children
 * @param className {string} Additionnal CSS Classes
 */
const Breadcrumb = async ({ children, className, ...others }: BreadcrumbWebProps): Promise<React.ReactNode> => {
  return (
    <nav className={classNames('breadcrumb', className)} aria-label='breadcrumbs' {...others}>
      <ul>{children}</ul>
    </nav>
  )
}

export default Breadcrumb
