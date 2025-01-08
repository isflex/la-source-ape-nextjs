import React from 'react'
import classNames from 'classnames'
import { BreadcrumbWebProps } from './BreadcrumbProps.js'

/**
 * Breadcrumb Component
 * @param children {ReactNode} Breadcrumb Children
 * @param className {string} Additionnal CSS Classes
 */
const Breadcrumb = ({ children, className, ...others }: BreadcrumbWebProps): React.JSX.Element => {
  return (
    <nav className={classNames('breadcrumb', className)} aria-label='breadcrumbs' {...others}>
      <ul>{children}</ul>
    </nav>
  )
}

export default Breadcrumb
