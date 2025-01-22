'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TableBodyProps } from './TableBodyProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
// import { type Styles } from '@flex-design-system/framework'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Table Body Component
 * @param children {ReactNode} children of Table Body
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const TableBody = async ({ className, classList, ...others }: TableBodyProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className, validate(classList))

  return <tbody className={classes} {...others} />
}

export default TableBody
