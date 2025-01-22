'use server'

import React from 'react'
import classNames from 'classnames'
import { ToolbarItemWebProps } from './ToolbarItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Toolbar Item Component
 * @param className {string} Additionnal CSS Classes
 * @param clippedToBottom {boolean} Is clipped to bottom
 */
const ToolbarItem = async ({ className, clippedToBottom, ...others }: ToolbarItemWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('toolbar-item', clippedToBottom && is('clipped-to-bottom'), className)
  return <div className={classes} {...others} />
}

export default ToolbarItem
