'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../../services/index.js'
import { NavbarAccordionItemWebProps } from './NavbarAccordionItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar Accordion Item Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param headerContent {string} Content text for navbar-item-accordion-header
 */
const NavbarAccordionItem = async ({
  children,
  className,
  classList,
  headerContent,
  ...others
}: NavbarAccordionItemWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.navbarItemAccordion, className, validate(classList))
  const headerClasses = classNames(styles.navbarItemAccordionHeader)
  const contentClasses = classNames(styles.navbarItemAccordionContent)

  return (
    <div className={classes} {...others}>
      <div className={headerClasses}>{headerContent}</div>
      <div className={contentClasses}>{children}</div>
    </div>
  )
}

export default NavbarAccordionItem
