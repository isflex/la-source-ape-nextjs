'use server'

import React from 'react'
import classNames from 'classnames'
import { DropdownDividerWebProps } from './DropdownDividerProps.js'
import { is } from '../../../services/index.js'

/**
 * Dropdown Divider Component
 * @param className {string} Additionnal CSS Classes
 */
const DropdownDivider = async ({ className, ...others }: DropdownDividerWebProps): Promise<React.ReactNode> => {
  const classes = classNames('dropdown-divider', is('divider'), className)

  return <hr className={classes} {...others} />
}

export default DropdownDivider
