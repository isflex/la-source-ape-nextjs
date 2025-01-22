'use server'

import React from 'react'
import classNames from 'classnames'
import { MenuWebProps } from './MenuProps.js'

const a11y = { role: 'menu' }

/**
 * Menu Component
 *  @param className {string} Additionnal CSS Classes
 *  @param children {ReactNode} Dropdown Children
 *  @param notASide {ReactNode} Menu is in MenuScrolling
 */

const Menu = async ({ className, notASide, ...others }: MenuWebProps): Promise<React.AwaitedReactNode> => (
  <ul className={classNames('menu-list', !notASide && 'aside-menu-list', className)} {...a11y} {...others} />
)

export default Menu
