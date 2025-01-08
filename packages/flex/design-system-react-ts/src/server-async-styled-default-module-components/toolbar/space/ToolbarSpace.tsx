// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { ToolbarSpaceWebProps } from './ToolbarSpaceProps.js'

/**
 * Toolbar Space Component
 * @param className {string} Additionnal CSS Classes
 */
const ToolbarSpace = async ({ className, ...others }: ToolbarSpaceWebProps): Promise<React.JSX.Element> => (
  <div className={classNames('toolbar-space', className)} {...others} />
)

export default ToolbarSpace
