import React from 'react'
import classNames from 'classnames'
import { DropdownMenuWebProps } from './DropdownMenuProps.js'

/**
 * Dropdown Menu Component
 * @param children {ReactNode} Children for Dropdown menu (Dropdown item)
 * @param className {string} Additionnal CSS Classes
 */
const DropdownMenu = ({ children, className, ...others }: DropdownMenuWebProps): React.JSX.Element => {
  const classes = classNames('dropdown-menu', className)

  return (
    <div className={classes} {...others}>
      <div className='dropdown-content'>{children}</div>
    </div>
  )
}

export default DropdownMenu
