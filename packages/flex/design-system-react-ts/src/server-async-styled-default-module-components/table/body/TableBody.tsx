'use server'

import React from 'react'
import classNames from 'classnames'
import { TableBodyProps } from './TableBodyProps.js'

/**
 * Table Body Component
 * @param children {ReactNode} children of Table Body
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TableBody = async ({ className, ...others }: TableBodyProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className)

  return <tbody className={classes} {...others} />
}

export default TableBody
