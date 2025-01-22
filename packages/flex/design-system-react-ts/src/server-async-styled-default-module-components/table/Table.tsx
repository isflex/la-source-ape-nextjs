'use server'

import React from 'react'
import classNames from 'classnames'
import { TableProps } from './TableProps.js'
import { is } from '../../services/index.js'

/**
 * Table Component
 * @param bordered {boolean} bordered table
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param fullwidth {boolean} Fullwidth table
 * @param comparative {boolean} If specific design add this
 */
const Table = async ({ className, fullwidth, bordered, comparative, ...others }: TableProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('table', fullwidth && is('fullwidth'), bordered && is('bordered'), comparative && is('comparative'), className)

  return <table className={classes} {...others} />
}

export default Table
