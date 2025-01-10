'use client'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { validate, is, has } from '../../services/index.js'
import { camelCase } from 'lodash'
import { RadioProps } from './RadioProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Radio Component
 * @param checked {boolean} Checked Radio
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param disabled {boolean} Disabled
 * @param readOnly {boolean} readonly Radio
 * @param id {string} Id for button, by default id is generate
 * @param label {string} Label for Radio
 * @param labelClassName {string} addtionnial CSS Classes for label
 * @param onClick {ClickEvent}
 * @param onChange {ChangeEvent}
 * @param name {string} Name for radio
 * @param value {string} Value for radio
 */
const Radio = ({
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
  ...others
}: RadioProps): React.JSX.Element => {
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
    <div className={styles.field}>
      <div className={classNames(styles.control, disabled && styles[camelCase(is('disabled')) as keyof Styles])}>
        <input
          className={classes}
          type='radio'
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
            // if (!readonly && target.checked !== undefined) {
            //   setChecked(target.checked)
            // }
            target.value = value || ''
            if (onChange) {
              onChange({
                radioId: target.id,
                radioValue: target.value,
                radioName: target.name,
                radioChecked: target.checked,
              })
            }
            if (onClick) {
              onClick({
                radioId: target.id,
                radioValue: target.value,
                radioName: target.name,
                radioChecked: target.checked,
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

export default Radio
