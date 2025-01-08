// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { TimelineWebProps } from './TimelineProps.js'

/**
 * Timeline Component
 * @param className {string} Additionnal CSS Classes
 * @param notifications {boolean} Timeline notification rendering
 */
const Timeline = async ({ className, notifications, ...others }: TimelineWebProps): Promise<React.JSX.Element> => {
  const classes = classNames('timeline', notifications && notifications, className)

  return <div className={classes} {...others} />
}

export default Timeline
