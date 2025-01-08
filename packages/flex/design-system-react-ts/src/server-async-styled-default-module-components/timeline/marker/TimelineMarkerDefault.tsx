// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TimelineMarkerWebProps } from './TimelineMarkerProps.js'
import { Icon, IconSize } from '../../icon/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Timeline Item Component
 * @param className {string} Additionnal CSS Classes
 * @param iconClassname {string} Additionnal CSS Classes for icon
 * @param iconName {IconName} Icon Name - sample : IconName.ENVELOPE
 */
const TimelineItem = async ({ className, classList, iconClassname, iconName, ...others }: TimelineMarkerWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.timelineMarker, styles.isIcon, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <div className={styles.cardHeaderIcon}>
        <Icon className={classNames(iconClassname, styles.hasTextGrey)} name={iconName} size={IconSize.SMALL} />
      </div>
    </div>
  )
}

export default TimelineItem
