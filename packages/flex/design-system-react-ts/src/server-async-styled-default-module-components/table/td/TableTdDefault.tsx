'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TableTdProps } from './TableTdProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
// import { type Styles } from '@flex-design-system/framework'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Table TD Component
 * @param children {ReactNode} Table TD children
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param rowSpan {number} Specifies the number of rows a cell should span
 * @param colSpan {number} Defines the number of columns a cell should span
 */
const TableTd = async ({ className, classList, rowSpan, colSpan, ...others }: TableTdProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className, validate(classList))

  return <td className={classes} rowSpan={rowSpan} colSpan={colSpan} {...others} />
}

export default TableTd
