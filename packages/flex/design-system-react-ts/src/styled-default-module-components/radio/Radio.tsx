import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { RadioProps } from './RadioProps.js'
import { is, has } from '../../services/index.js'

/**
 * Radio Component
 * @param checked {boolean} Checked Radio
 * @param className {string} Additionnal CSS Classes
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
    <div className='field'>
      <div className={classNames('control', disabled && is('disabled'))}>
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
            if (!readonly && target.checked !== undefined) {
              setChecked(target.checked)
            }
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
