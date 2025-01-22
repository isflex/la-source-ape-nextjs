'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { RowsItemProps } from './RowItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Rows Item Component
 * @param narrow {boolean} Align same elements horizontaly
 * - -------------------------- WEB PROPERTIES -------------------
 *  @param className {string} additionnal CSS Classes
 */
const RowItem = async ({ className, classList, narrow, ...others }: RowsItemProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(styles.row, narrow && styles.isNarrow, className, validate(classList))

  return <div className={classes} {...others} />
}

export default RowItem
