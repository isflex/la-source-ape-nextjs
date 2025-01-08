'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { RowsProps } from './RowsProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Rows Component
 * @param children {ReactNode} Rows children
 * - ------------------- WEB PROPERTIES -------------------------
 * @param className {string} additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const Rows = ({ className, classList, ...others }: RowsProps): JSX.Element => (
  <div className={classNames(styles.rows, className, validate(classList))} {...others} />
)

export default Rows
