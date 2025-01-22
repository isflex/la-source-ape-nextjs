'use server'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { CheckboxProps } from './CheckboxProps.js'
import { is, has } from '../../services/index.js'

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
 * @param className {string} Additionnal CSS Classes
 * @param labelClassName {string} addtionnial CSS Classes for label
 * @param value {string} Value for checkbox
 * @param removeControl {boolean} Remove control class
 * @param removeField {boolean} Remove field class
 */
const Checkbox = async ({
  checked,
  className,
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
}: CheckboxProps): Promise<React.AwaitedReactNode> => {
  const [_checked, setChecked] = React.useState<boolean>(checked || false)

  const classes = classNames(
    'input',
    is('checkradio'),
    is('info'),
    is('hidden'),
    inverted && is('inverted'),
    className && !className.includes(is('inverted')) && has('background-color'),
    className,
  )

  const labelClasses = classNames(checked && has('text-info'), labelClassName)

  React.useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  const idGenerated = nanoid()

  return (
    <div className={(!removeField && 'field') || ''}>
      <div className={classNames(!removeControl && 'control', disabled && is('disabled'))}>
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
