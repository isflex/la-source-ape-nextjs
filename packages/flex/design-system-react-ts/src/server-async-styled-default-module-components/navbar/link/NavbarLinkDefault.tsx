// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { NavbarLinkWebProps } from './NavbarLinkProps.js'
import { Link as RouterLink } from 'react-router'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Navbar link Component
 * @param children {ReactNode} Children link if not content
 * @param className {string} Additionnal css classes
 * @param to {string} link to url
 * @param href {string} Href link
 * @param content {string} Text content if not children
 * @param highlighted {boolean} Highlighted link
 * @param onClick {Function} onClick Event
 */
const NavbarLink = async ({
  children,
  className,
  classList,
  to,
  highlighted,
  content,
  onClick,
  ...others
}: NavbarLinkWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.navbarLink, highlighted && styles.isHighlighted, className, validate(classList))

  if (to) {
    return (
      <RouterLink onClick={onClick} className={classes} to={to || ''} {...others}>
        <span>
          {content && !children && content}
          {!content && children && children}
        </span>
      </RouterLink>
    )
  }

  return (
    <a onClick={onClick} href={to} className={classes} {...others}>
      {content && !children && content}
      {!content && children && children}
    </a>
  )
}

export default NavbarLink
