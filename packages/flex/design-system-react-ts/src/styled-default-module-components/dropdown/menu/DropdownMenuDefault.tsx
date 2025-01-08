'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
// import { camelCase } from 'lodash'
import { DropdownMenuWebProps } from './DropdownMenuProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Dropdown Menu Component
 * @param children {ReactNode} Children for Dropdown menu (Dropdown item)
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const DropdownMenu = ({ children, className, classList, ...others }: DropdownMenuWebProps): React.JSX.Element => {
  const classes = classNames(styles.dropdownMenu, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <div className={styles.dropdownContent}>{children}</div>
    </div>
  )
}

export default DropdownMenu
