// @ts-nocheck

'use server'

import React from 'react'
import { SubMenuItemWebProps } from './SubMenuItemProps.js'

/**
 * SubMenuItem Component - A Sub Item Menu Component
 * @param children {ReactNode} Children for SubMenuItem
 * @param className {string} Additionnal CSS Classes
 */

const SubMenuItem = async ({ className, ...others }: SubMenuItemWebProps): Promise<React.JSX.Element> => <ul className={className} {...others} />

export default SubMenuItem
