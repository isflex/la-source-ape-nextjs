// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { TableTrProps } from './TableTrProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Table TR Component
 * @param expandable {boolean} Lines can display additional information
 * @param expanded {boolean} An unfolded line will also receive class
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const TableTr = async ({ className, classList, expandable, expanded, ...others }: TableTrProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    expandable && styles[camelCase(is('expandable')) as keyof Styles],
    expanded ? styles[camelCase(is('expanded')) as keyof Styles] : null,
    className,
    validate(classList),
  )

  return <tr className={classes} {...others} />
}

export default TableTr
