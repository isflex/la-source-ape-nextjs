'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
// import { camelCase } from 'lodash'
import { DropdownTriggerWebProps } from './DropdownTriggerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Dropdown Trigger Component
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param active {boolean} Active trigger
 * @param onClick {onClick} onClick event
 * @param label {string} Trigger label
 * @param placeholder {string} Trigger placeholder
 */
const DropdownTrigger = ({ className, classList, active, onClick, label, name, ...others }: DropdownTriggerWebProps): React.JSX.Element => {
  const [triggered, setTriggered] = React.useState<boolean>(active || false)

  const classes = classNames(styles.dropdownTrigger, triggered && is('triggered'), className, validate(classList))

  React.useEffect(() => {
    setTriggered(active || false)
  }, [active])

  return (
    <div
      onClick={(e: React.MouseEvent) => {
        const target = e.target as HTMLFormElement
        setTriggered(!triggered)
        target.active = !triggered
        if (onClick) {
          onClick({
            active: target.active,
          })
        }
      }}
      className={classes}
      {...others}
    >
      <div className={styles.field}>
        <div className={classNames(styles.control, styles.hasDynamicPlaceholder)}>
          <div className={styles.select}>
            <select name={name} />
            <label className={styles.inputDynamicPlaceholder}>{label}</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropdownTrigger
