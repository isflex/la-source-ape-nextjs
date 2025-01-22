'use server'

import React from 'react'
import classNames from 'classnames'
import { TableTrProps } from './TableTrProps.js'
import { is } from '../../../services/index.js'

/**
 * Table TR Component
 * @param expandable {boolean} Lines can display additional information
 * @param expanded {boolean} An unfolded line will also receive class
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TableTr = async ({ className, expandable, expanded, ...others }: TableTrProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className, expandable && is('expandable'), expanded ? is('expanded') : null)

  return <tr className={classes} {...others} />
}

export default TableTr
