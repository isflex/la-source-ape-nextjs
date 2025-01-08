import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { SelectOptionProps } from './SelectOptionProps.js'

/**
 * Select Option Component
 * @param selected {boolean} Selected option
 * @param value {string} Select option value
 * @param id {string} Select option custom id
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param placeholder Select Option Placeholder
 */
const SelectOption = ({ id, className, selected, value, disabled, ...others }: SelectOptionProps): React.JSX.Element => {
  const idGenerated = nanoid()

  return <option id={id || idGenerated} className={classNames(className)} selected={selected} value={value} disabled={disabled} {...others} />
}

export default SelectOption
