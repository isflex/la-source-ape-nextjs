// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { ToolbarGroupWebProps } from './ToolbarGroupProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Toolbar Group
 * @param className {string} Additionnal CSS Classes
 * @param elastic {boolean} Is elastic
 */
const ToolbarGroup = async ({ className, classList, elastic, ...others }: ToolbarGroupWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.toolbarGroup, elastic && styles.isElastic, className, validate(classList))

  return <div className={classes} {...others} />
}

export default ToolbarGroup
