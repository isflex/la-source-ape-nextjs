// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is } from '../../services/index.js'
import { PopoverWebProps } from './PopoverProps.js'

/**
 * Popover Component
 * @param children {ReactNode} Popover children
 * @param className {string} Additionnal CSS Classes
 * @param direction {PopoverDirection} Popover direction (DOWN|LEFT|RIGHT)
 * @param children {ReactNode} Content React Node Element
 * @param content {ReactNode} Content of the popover (hidden popover if null|undefined)
 * @param active {boolean} Is the popover active
 * @param arrowPosition {PopoverArrowPosition} Position of the popover arrow
 */
const Popover = async ({
  className,
  direction,
  children,
  active,
  arrowPosition,
  content,
  ...others
}: PopoverWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    'popover',
    direction != null && is(`popover-${direction}`),
    active && is('popover-active'),
    arrowPosition != null && is(`arrow-${arrowPosition}`),
    className,
  )

  return (
    <div className={classes} {...others}>
      {children}
      {content != null && <div className='popover-content'>{content}</div>}
    </div>
  )
}

export default Popover
