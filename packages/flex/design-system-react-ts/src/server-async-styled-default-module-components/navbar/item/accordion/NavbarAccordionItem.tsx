'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarAccordionItemWebProps } from './NavbarAccordionItemProps.js'

/**
 * Navbar Accordion Item Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param headerContent {string} Content text for navbar-item-accordion-header
 */
const NavbarAccordionItem = async ({ children, className, headerContent, ...others }: NavbarAccordionItemWebProps): Promise<React.ReactNode> => {
  const classes = classNames('navbar-item-accordion', className)
  const headerClasses = classNames('navbar-item-accordion-header')
  const contentClasses = classNames('navbar-item-accordion-content')

  return (
    <div className={classes} {...others}>
      <div className={headerClasses}>{headerContent}</div>
      <div className={contentClasses}>{children}</div>
    </div>
  )
}

export default NavbarAccordionItem
