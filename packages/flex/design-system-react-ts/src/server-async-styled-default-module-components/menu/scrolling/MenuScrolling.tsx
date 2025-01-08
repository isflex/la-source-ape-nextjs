// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { MenuScrollingProps } from './MenuScrollingProps.js'

const a11y = { role: 'scrolling-menu' }

/**
 * Menu Component
 *  @param className {string} Additionnal CSS Classes
 *  @param children {number} ReactNode} Dropdown Children
 */

const MenuScrolling = async ({ className, hasBackgroundWhite, pulled, ...others }: MenuScrollingProps): Promise<React.JSX.Element> => {
  /**
   * If no markup return p with default level 1
   */
  const classes = ['menu', `is-pulled-${pulled ?? 'left'}`, className]
  if (hasBackgroundWhite) {
    classes.push('has-background-white')
  }
  return <aside className={classNames(classes)} {...a11y} {...others} />
}

export default MenuScrolling
