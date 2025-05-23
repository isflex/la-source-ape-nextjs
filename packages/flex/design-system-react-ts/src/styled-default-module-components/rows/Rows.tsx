import React from 'react'
import classNames from 'classnames'
import { RowsProps } from './RowsProps.js'

/**
 * Rows Component
 * @param children {ReactNode} Rows children
 * - ------------------- WEB PROPERTIES -------------------------
 * @param className {string} additionnal CSS Classes
 */
const Rows = ({ className, ...others }: RowsProps): React.JSX.Element => <div className={classNames('rows', className)} {...others} />

export default Rows
