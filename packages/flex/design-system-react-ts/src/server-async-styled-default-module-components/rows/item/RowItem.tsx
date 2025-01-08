// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { RowsItemProps } from './RowItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Rows Item Component
 * @param narrow {boolean} Align same elements horizontaly
 * - -------------------------- WEB PROPERTIES -------------------
 *  @param className {string} additionnal CSS Classes
 */
const RowItem = async ({ className, narrow, ...others }: RowsItemProps): Promise<React.JSX.Element> => {
  const classes = classNames('row', narrow && is('narrow'), className)

  return <div className={classes} {...others} />
}

export default RowItem
