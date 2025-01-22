'use server'

import React from 'react'
import classNames from 'classnames'
import { DropdownTriggerWebProps } from './DropdownTriggerProps.js'
import { has, is } from '../../../services/index.js'

/**
 * Dropdown Trigger Component
 * @param className {string} Additionnal CSS Classes
 * @param active {boolean} Active trigger
 * @param onClick {onClick} onClick event
 * @param label {string} Trigger label
 * @param placeholder {string} Trigger placeholder
 */
const DropdownTrigger = async ({ className, active, onClick, label, name, ...others }: DropdownTriggerWebProps): Promise<React.AwaitedReactNode> => {
  const [triggered, setTriggered] = React.useState<boolean>(active || false)

  const classes = classNames('dropdown-trigger', triggered && is('triggered'), className)

  React.useEffect(() => {
    setTriggered(active || false)
  }, [active])

  return (
    <div
      onClick={(e: React.MouseEvent) => {
        const target = e.target as HTMLFormElement
        setTriggered(!triggered)
        target.active = !triggered
        if (onClick) {
          onClick({
            active: target.active,
          })
        }
      }}
      className={classes}
      {...others}
    >
      <div className='field'>
        <div className={`control ${has('dynamic-placeholder')}`}>
          <div className='select'>
            <select name={name} />
            <label className='input-dynamic-placeholder'>{label}</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropdownTrigger
