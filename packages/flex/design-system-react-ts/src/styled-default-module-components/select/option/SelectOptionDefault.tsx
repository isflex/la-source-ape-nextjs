'use client'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { validate } from '../../../services/index.js'
import { SelectOptionProps } from './SelectOptionProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
// import { type Styles } from '@flex-design-system/framework'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Select Option Component
 * @param value {string} Select option value
 * @param id {string} Select option custom id
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param placeholder Select Option Placeholder
 */
const SelectOption = ({ id, className, classList, value, disabled, ...others }: SelectOptionProps): React.JSX.Element => {
  const idGenerated = nanoid()

  return <option id={id || idGenerated} className={classNames(className, validate(classList))} value={value} disabled={disabled} {...others} />
}

export default SelectOption
