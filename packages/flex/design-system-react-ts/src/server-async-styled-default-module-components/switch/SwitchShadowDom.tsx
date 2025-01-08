/* eslint-disable */
// @ts-nocheck

'use server'

import React from 'react'
import ReactShadowRoot from 'react-shadow-root'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { SwitchProps } from './SwitchProps.js'
import { is } from '../../services/index.js'
// import sheet from '@flex-design-system/framework/switch.module.scss'

// ts-ignore
// console.log('scss', sheet)
// debugger

// import sheet from '@flex-design-system/framework/switch.module.scss' assert { type: 'css' }
// document.adoptedStyleSheets = [sheet]
// shadowRoot.adoptedStyleSheets = [sheet]

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
const SwitchShadowDom = async ({
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
}: SwitchProps): Promise<React.JSX.Element> => {
  const [_checked, setChecked] = React.useState<boolean>(checked || false)

  React.useEffect(() => {
    setChecked(checked || false)
  }, [checked])

  const classes = classNames(
    'switch',
    is('checkradio'),
    alert && is(alert.getClassName()),
    disabled && is(`${disabled}`),
    inverted && is('inverted'),
    className
  )

  React.useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  const idGenerated = nanoid()

  return (
    <div> {/* The shadow root will be attached to this DIV */}
      <ReactShadowRoot>
        {/* <style>{sheet}</style> */}
        <div className='field'>
          <div className='control'>
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
      </ReactShadowRoot>
    </div>
  )
}

export default SwitchShadowDom
