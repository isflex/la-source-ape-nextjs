'use server'

import React from 'react'
import classNames from 'classnames'
import { TableTdProps } from './TableTdProps.js'

/**
 * Table TD Component
 * @param children {ReactNode} Table TD children
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param rowSpan {number} Specifies the number of rows a cell should span
 * @param colSpan {number} Defines the number of columns a cell should span
 */
const TableTd = async ({ className, rowSpan, colSpan, ...others }: TableTdProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className)

  return <td className={classes} rowSpan={rowSpan} colSpan={colSpan} {...others} />
}

export default TableTd
