// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { SliceIconProps } from './SliceIconProps.js'
import { Icon } from '../../icon/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slice Icon Component
 * @param className {string} Additionnal CSS Classes
 * @param iconSize {IconSize} Size for icon
 * @param iconName {IconName} Name for icon
 * @param iconColor {IconColor} Custom color for icon
 */
const SliceIcon = async ({ className, classList, iconSize, iconName, iconColor, ...others }: SliceIconProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.sliceIcon, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <Icon name={iconName} {...(iconColor && { color: iconColor })} {...(iconSize && { size: iconSize })} />
    </div>
  )
}

export default SliceIcon
