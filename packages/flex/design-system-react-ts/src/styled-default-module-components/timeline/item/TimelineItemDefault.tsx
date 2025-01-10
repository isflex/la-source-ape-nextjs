'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TimelineItemWebProps } from './TimelineItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Timeline Item Component
 * @param className {string} Additionnal CSS Classes
 * @param active {boolean} Active Timeline Item
 */
const TimelineItem = ({ className, classList, active, ...others }: TimelineItemWebProps): React.JSX.Element => {
  const classes = classNames(styles.timelineItem, active && styles.active, className, validate(classList))

  return <div className={classes} {...others} />
}

export default TimelineItem
