'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { MenuWebProps } from './MenuProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

const a11y = { role: 'menu' }

/**
 * Menu Component
 *  @param className {string} Additionnal CSS Classes
 *  @param children {ReactNode} Dropdown Children
 *  @param notASide {ReactNode} Menu is in MenuScrolling
 */

const Menu = async ({ className, classList, notASide, ...others }: MenuWebProps): Promise<React.AwaitedReactNode> => (
  <ul className={classNames(styles.menuList, !notASide && styles.asideMenuList, className, validate(classList))} {...a11y} {...others} />
)

export default Menu
