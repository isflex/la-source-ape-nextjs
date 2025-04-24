'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SubMenuItemWebProps } from './SubMenuItemProps.js'

/**
 * SubMenuItem Component - A Sub Item Menu Component
 * @param children {ReactNode} Children for SubMenuItem
 * @param className {string} Additionnal CSS Classes
 */

const SubMenuItem = async ({ className, classList, ...others }: SubMenuItemWebProps): Promise<React.ReactNode> => (
  <ul className={classNames(className, validate(classList))} {...others} />
)

export default SubMenuItem
