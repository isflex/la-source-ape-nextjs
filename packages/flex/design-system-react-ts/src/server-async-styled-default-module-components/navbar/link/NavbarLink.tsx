'use server'

import React from 'react'
import classNames from 'classnames'
import { NavbarLinkWebProps } from './NavbarLinkProps.js'
import { is } from '../../../services/index.js'
import { Link as RouterLink } from 'react-router'

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
const NavbarLink = async ({ children, className, to, highlighted, content, onClick, ...others }: NavbarLinkWebProps): Promise<React.ReactNode> => {
  const classes = classNames('navbar-link', highlighted && is('highlighted'), className)

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
