// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { TableProps } from './TableProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Table Component
 * @param bordered {boolean} bordered table
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param fullwidth {boolean} Fullwidth table
 * @param comparative {boolean} If specific design add this
 */
const Table = async ({ className, classList, fullwidth, bordered, comparative, ...others }: TableProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.table,
    fullwidth && styles[camelCase(is('fullwidth')) as keyof Styles],
    bordered && styles[camelCase(is('bordered')) as keyof Styles],
    comparative && styles[camelCase(is('comparative')) as keyof Styles],
    className,
    validate(classList),
  )

  return <table className={classes} {...others} />
}

export default Table
