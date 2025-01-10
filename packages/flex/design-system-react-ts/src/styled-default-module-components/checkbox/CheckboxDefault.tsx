'use client'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { validate, is, has } from '../../services/index.js'
import { camelCase } from 'lodash'
import { CheckboxProps } from './CheckboxProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Checkbox Component
 * @param checked {boolean} Checked Checkbox
 * @param disabled {boolean} Disabled
 * @param readOnly {boolean} readonly Checkbox
 * @param id {string} Id for button, by default id is generate
 * @param label {string} Label for Checkbox
 * @param onClick {ClickEvent}
 * @param onChange {ChangeEvent}
 * @param name {string} Name for checkbox
 * @param inverted {boolean} Inveted Checkbox color
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param labelClassName {string} addtionnial CSS Classes for label
 * @param value {string} Value for checkbox
 * @param removeControl {boolean} Remove control class
 * @param removeField {boolean} Remove field class
 */
const Checkbox = ({
  checked,
  className,
  classList,
  disabled,
  readonly,
  id,
  label,
  labelClassName,
  onChange,
  onClick,
  name,
  value,
  inverted,
  removeControl,
  removeField,
  ...others
}: CheckboxProps): React.JSX.Element => {
  const [_checked, setChecked] = React.useState<boolean>(checked || false)

  const classes = classNames(
    styles.input,
    styles[camelCase(is('checkradio')) as keyof Styles],
    styles[camelCase(is('info')) as keyof Styles],
    styles[camelCase(is('hidden')) as keyof Styles],
    inverted && styles[camelCase(is('inverted')) as keyof Styles],
    className && !className.includes(styles[camelCase(is('inverted')) as keyof Styles]) && styles[camelCase(has('background-color')) as keyof Styles],
    className,
    validate(classList),
  )

  const labelClasses = classNames(checked && styles[camelCase(has('text-info')) as keyof Styles], labelClassName)

  React.useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  const idGenerated = nanoid()

  return (
    <div className={(!removeField && styles.field) || ''}>
      <div className={classNames(!removeControl && styles.control, disabled && styles[camelCase(is('disabled')) as keyof Styles])}>
        <input
          className={classes}
          type='checkbox'
          readOnly={readonly}
          id={id || idGenerated}
          disabled={disabled}
          name={name}
          value={value}
          checked={readonly ? checked : _checked}
          onChange={(e: React.ChangeEvent) => {
            return e
          }}
          onClick={(e: React.MouseEvent) => {
            const target = e.target as HTMLInputElement
            if (!readonly && target.checked !== undefined) {
              setChecked(target.checked)
            }
            target.value = value || ''
            if (onChange) {
              onChange({
                checkboxId: target.id,
                checkboxValue: target.value,
                checkboxName: target.name,
                checkboxChecked: target.checked,
              })
            }
            if (onClick) {
              onClick({
                checkboxId: target.id,
                checkboxValue: target.value,
                checkboxName: target.name,
                checkboxChecked: target.checked,
              })
            }
          }}
          {...others}
        />
        <label htmlFor={id || idGenerated} className={labelClasses}>
          {label}
        </label>
      </div>
    </div>
  )
}

export default Checkbox
