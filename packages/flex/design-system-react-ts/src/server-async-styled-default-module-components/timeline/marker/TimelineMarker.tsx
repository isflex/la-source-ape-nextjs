'use server'

import React from 'react'
import classNames from 'classnames'
import { TimelineMarkerWebProps } from './TimelineMarkerProps.js'
import { is, has } from '../../../services/index.js'
import { Icon, IconSize } from '../../icon/index.js'

/**
 * Timeline Item Component
 * @param className {string} Additionnal CSS Classes
 * @param iconClassname {string} Additionnal CSS Classes for icon
 * @param iconName {IconName} Icon Name - sample : IconName.ENVELOPE
 */
const TimelineItem = async ({ className, iconClassname, iconName, ...others }: TimelineMarkerWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('timeline-marker', is('icon'), className)

  return (
    <div className={classes} {...others}>
      <div className='card-header-icon'>
        <Icon className={iconClassname + has('text-grey')} name={iconName} size={IconSize.SMALL} />
      </div>
    </div>
  )
}

export default TimelineItem
