import React from 'react'
import classNames from 'classnames'
import { TableHeadProps } from './TableHeadProps.js'

/**
 * Table Head Component
 * @param children {ReactNode} children of Table Head
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TableHead = ({ className, ...others }: TableHeadProps): React.JSX.Element => {
  const classes = classNames(className)

  return <thead className={classes} {...others} />
}

export default TableHead
