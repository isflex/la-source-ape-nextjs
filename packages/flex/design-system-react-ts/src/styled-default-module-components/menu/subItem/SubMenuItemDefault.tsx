'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SubMenuItemWebProps } from './SubMenuItemProps.js'

/**
 * SubMenuItem Component - A Sub Item Menu Component
 * @param children {ReactNode} Children for SubMenuItem
 * @param className {string} Additionnal CSS Classes
 */

const SubMenuItem = ({ className, classList, ...others }: SubMenuItemWebProps): React.JSX.Element => (
  <ul className={classNames(className, validate(classList))} {...others} />
)

export default SubMenuItem
