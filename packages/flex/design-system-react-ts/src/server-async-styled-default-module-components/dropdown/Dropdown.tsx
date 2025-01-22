'use server'

import React from 'react'
import classNames from 'classnames'
import { DropdownWebProps } from './DropdownProps.js'
import { is } from '../../services/index.js'

/**
 * Dropdown Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Dropdown Children
 * @param active {boolean} Activated Dropdown
 */
const Dropdown = async ({ className, children, active, ...others }: DropdownWebProps): Promise<React.AwaitedReactNode> => {
  const [displayDropdown, setDisplayDropdown] = React.useState<boolean>(active || false)

  const classes = classNames('dropdown tile', displayDropdown && is('active'), className)

  React.useEffect(() => {
    setDisplayDropdown(active || false)
  }, [active])

  return (
    <div className='field'>
      <div className='control'>
        <div
          onClick={() => {
            setDisplayDropdown(!displayDropdown)
          }}
          className={classes}
          {...others}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dropdown
