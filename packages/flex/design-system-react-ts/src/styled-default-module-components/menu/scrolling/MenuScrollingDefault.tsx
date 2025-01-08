'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { MenuScrollingProps } from './MenuScrollingProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

const a11y = { role: 'scrolling-menu' }

/**
 * Menu Component
 *  @param className {string} Additionnal CSS Classes
 *  @param children {number} ReactNode} Dropdown Children
 */

const MenuScrolling = ({ className, classList, hasBackgroundWhite, pulled, ...others }: MenuScrollingProps): React.JSX.Element => {
  /**
   * If no markup return p with default level 1
   */
  const classes = classNames(
    styles.menu,
    styles[camelCase(`is-pulled-${pulled ?? 'left'}`) as keyof Styles],
    hasBackgroundWhite && styles.hasBackgroundWhite,
    className,
    validate(classList),
  )

  return <aside className={classes} {...a11y} {...others} />
}

export default MenuScrolling
