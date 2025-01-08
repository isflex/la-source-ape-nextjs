'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { BoxContentProps } from './BoxContentProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Box Content
 * @param children {ReactNode} Box Content Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const BoxContent = ({ children, className, classList, ...others }: BoxContentProps): React.JSX.Element => {
  return (
    <div className={classNames(styles.boxContent, className, validate(classList))} {...others}>
      {children}
    </div>
  )
}

export default BoxContent
