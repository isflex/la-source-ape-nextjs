'use server'

import React from 'react'
import classNames from 'classnames'
import { ToolbarGroupWebProps } from './ToolbarGroupProps.js'
import { is } from '../../../services/index.js'

/**
 * Toolbar Group
 * @param className {string} Additionnal CSS Classes
 * @param elastic {boolean} Is elastic
 */
const ToolbarGroup = async ({ className, elastic, ...others }: ToolbarGroupWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('toolbar-group', elastic && is('elastic'), className)

  return <div className={classes} {...others} />
}

export default ToolbarGroup
