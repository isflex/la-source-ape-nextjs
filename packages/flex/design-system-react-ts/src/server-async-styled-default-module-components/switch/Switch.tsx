/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { camelCase } from 'lodash'
import { SwitchProps } from './SwitchProps.js'
import { is } from '../../services/index.js'
/////////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
/////////////////////////////////////////////////////////////////////////////

/**
 * Switch Component
 * @param id {string} Is auto generate by default
 * @param label {string} Switch label
 * @param value {string} Switch value
 * @param checked {boolean} Checked switch
 * @param onChange {Function} onChange event
 * @param alert {AlertState} Alert Variant (INFO|SUCCESS|WARNING|DANGER)
 * @param disabled {boolean} Switch disabled
 * @param readonly {boolean} Switch readonly
 * @param name {string} Switch name
 * @param inverted {boolean} Invert switch color
 * -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const Switch = async ({
  className,
  id,
  label,
  value,
  checked,
  onChange,
  alert,
  disabled,
  readonly,
  name,
  inverted,
  ...others
}: SwitchProps): Promise<React.AwaitedReactNode> => {
  const [_checked, setChecked] = React.useState<boolean>(checked || false)

  React.useEffect(() => {
    setChecked(checked || false)
  }, [checked])

  const classes = classNames(
    styles.isSwitch,
    styles.isCheckradio,
    alert && styles[camelCase(is(alert.getClassName())) as keyof Styles],
    disabled && camelCase(is(`${disabled}`)),
    inverted && styles.isInverted,
    className,
    className
  )

  React.useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  const idGenerated = nanoid()

  return (
    <div className={styles.field}>
      <div className={styles.control}>
        <input
          onChange={(e) => {
            if (!readonly) {
              setChecked(!_checked)
            }
            if (onChange) {
              onChange({ switchState: e.target.checked, switchName: e.target.name })
            }
          }}
          name={name}
          value={value}
          checked={readonly ? checked : _checked}
          readOnly={readonly}
          className={classes}
          id={`switch-${id || idGenerated}`}
          type='checkbox'
          {...others}
        />
        <label htmlFor={`switch-${id || idGenerated}`}>{label}</label>
      </div>
    </div>
  )
}

export default Switch
