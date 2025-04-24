'use server'

import React from 'react'
import classNames from 'classnames'
import { SliceIconProps } from './SliceIconProps.js'
import { Icon } from '../../icon/index.js'

/**
 * Slice Icon Component
 * @param className {string} Additionnal CSS Classes
 * @param iconSize {IconSize} Size for icon
 * @param iconName {IconName} Name for icon
 * @param iconColor {IconColor} Custom color for icon
 */
const SliceIcon = async ({ className, iconSize, iconName, iconColor, ...others }: SliceIconProps): Promise<React.ReactNode> => {
  const classes = classNames('slice-icon', className)

  return (
    <div className={classes} {...others}>
      <Icon name={iconName} {...(iconColor && { color: iconColor })} {...(iconSize && { size: iconSize })} />
    </div>
  )
}

export default SliceIcon
