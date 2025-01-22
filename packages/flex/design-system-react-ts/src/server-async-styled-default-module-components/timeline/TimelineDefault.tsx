'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { TimelineWebProps } from './TimelineProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Timeline Component
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param notifications {boolean} Timeline notification rendering
 */
const Timeline = async ({ className, classList, notifications, ...others }: TimelineWebProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(styles.timeline, notifications && notifications, className, validate(classList))

  return <div className={classes} {...others} />
}

export default Timeline
