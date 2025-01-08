import React from 'react'
import classNames from 'classnames'
import { TimelineItemWebProps } from './TimelineItemProps.js'

/**
 * Timeline Item Component
 * @param className {string} Additionnal CSS Classes
 * @param active {boolean} Active Timeline Item
 */
const TimelineItem = ({ className, active, ...others }: TimelineItemWebProps): React.JSX.Element => {
  const classes = classNames('timeline-item', active && 'active', className)

  return <div className={classes} {...others} />
}

export default TimelineItem
