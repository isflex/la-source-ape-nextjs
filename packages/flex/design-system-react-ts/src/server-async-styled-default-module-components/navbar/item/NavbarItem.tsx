// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { NavbarItemWebProps } from './NavbarItemProps.js'
import { NavbarItemMarkup } from './NavbarItemEnum.js'
import { is } from '../../../services/index.js'

/**
 * Navbar Item Component
 * @param children {ReactNode} Children
 * @param className {string} Additionnal css classes
 * @param id {string} Custom id
 * @param markup {NavbarItemMarkup} Available : (DIV|A|SPAN|P) : Default : DIV
 * @param hoverable {boolean} Hoverable item
 * @param hiddenMobile {boolean} Hide on mobile
 * @param hiddenTablet {boolean} Hide on tablet
 * @param hiddenDesktop {boolean} Hide on desktop
 * @param alternate {boolean} Use it for connect button
 */
const NavbarItem = async ({
  children,
  id,
  className,
  megaDropdown,
  hoverable,
  markup,
  hiddenMobile,
  hiddenTablet,
  hiddenDesktop,
  alternate,
  active,
  ...others
}: NavbarItemWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    'navbar-item',
    megaDropdown && is('megadropdown-parent'),
    hoverable && is('hoverable'),
    hiddenMobile && is('hidden-mobile'),
    hiddenTablet && is('hidden-tablet'),
    hiddenDesktop && is('hidden-desktop'),
    alternate && is('alternate'),
    active && is('active'),
    className,
  )

  const Tag = markup && (markup in NavbarItemMarkup || Object.values(NavbarItemMarkup).includes(markup)) ? markup : 'div'

  const idGenerated = nanoid()

  return (
    <Tag id={id || idGenerated} className={classes} {...others}>
      {children}
    </Tag>
  )
}

export default NavbarItem
