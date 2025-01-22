'use server'

import React from 'react'
import classNames from 'classnames'
import { TableThProps } from './TableThProps.js'

/**
 * Table TH Component
 * @param children {ReactNode} Children of Table TH
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param rowSpan {number} Specifies the number of rows a cell should span
 * @param colSpan {number} Defines the number of columns a cell should span
 */
const TableTh = async ({ className, colSpan, rowSpan, ...others }: TableThProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className)

  return <th className={classes} colSpan={colSpan} rowSpan={rowSpan} {...others} />
}

export default TableTh
