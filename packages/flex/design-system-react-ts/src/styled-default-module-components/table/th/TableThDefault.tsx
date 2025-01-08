'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TableThProps } from './TableThProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default

// import { type Styles } from '@flex-design-system/framework'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Table TH Component
 * @param children {ReactNode} Children of Table TH
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param rowSpan {number} Specifies the number of rows a cell should span
 * @param colSpan {number} Defines the number of columns a cell should span
 */
const TableTh = ({ className, classList, colSpan, rowSpan, ...others }: TableThProps): React.JSX.Element => {
  const classes = classNames(className, validate(classList))

  return <th className={classes} colSpan={colSpan} rowSpan={rowSpan} {...others} />
}

export default TableTh
