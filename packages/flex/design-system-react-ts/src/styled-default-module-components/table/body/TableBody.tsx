import React from 'react'
import classNames from 'classnames'
import { TableBodyProps } from './TableBodyProps.js'

/**
 * Table Body Component
 * @param children {ReactNode} children of Table Body
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TableBody = ({ className, ...others }: TableBodyProps): React.JSX.Element => {
  const classes = classNames(className)

  return <tbody className={classes} {...others} />
}

export default TableBody
