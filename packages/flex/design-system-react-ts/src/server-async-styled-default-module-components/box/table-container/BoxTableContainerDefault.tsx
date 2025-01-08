// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { BoxTableContainerProps } from './BoxTableContainerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Box Table Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param children {ReactNode} Children
 */
const BoxTableContainer = async ({ className, classList, ...others }: BoxTableContainerProps): Promise<React.JSX.Element> => (
  <div className={classNames(styles.box, styles.tableContainer, className, validate(classList))} {...others} />
)

export default BoxTableContainer
