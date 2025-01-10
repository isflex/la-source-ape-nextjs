// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { ToolbarItemWebProps } from './ToolbarItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Toolbar Item Component
 * @param className {string} Additionnal CSS Classes
 * @param clippedToBottom {boolean} Is clipped to bottom
 */
const ToolbarItem = async ({ className, classList, clippedToBottom, ...others }: ToolbarItemWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.toolbarItem, clippedToBottom && styles.isClippedToBottom, className, validate(classList))

  return <div className={classes} {...others} />
}

export default ToolbarItem
