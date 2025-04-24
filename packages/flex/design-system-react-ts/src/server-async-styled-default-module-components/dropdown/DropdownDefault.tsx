'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { DropdownWebProps } from './DropdownProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Dropdown Component
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param children {ReactNode} Dropdown Children
 * @param active {boolean} Activated Dropdown
 */
const Dropdown = async ({ className, classList, children, active, ...others }: DropdownWebProps): Promise<React.ReactNode> => {
  const [displayDropdown, setDisplayDropdown] = React.useState<boolean>(active || false)

  const classes = classNames(styles.dropdown, styles.tile, displayDropdown && styles.isActive, className, validate(classList))

  React.useEffect(() => {
    setDisplayDropdown(active || false)
  }, [active])

  return (
    <div className={styles.field}>
      <div className={styles.control}>
        <div
          onClick={() => {
            setDisplayDropdown(!displayDropdown)
          }}
          className={classes}
          {...others}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dropdown
