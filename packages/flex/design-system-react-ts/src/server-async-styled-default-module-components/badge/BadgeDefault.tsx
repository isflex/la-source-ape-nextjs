'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { BadgeProps } from './BadgeProps.js'
import { Text, TextMarkup } from '../text/index.js'
import { BadgeTextDirection } from './BadgeEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Badge Component
 * @param children {ReactNode} If no content add children (Icon for example)
 * @param textContent {string} Content text for badge with text, if textContent props, it will display badge with text
 * @param content content {string|number} Badge content text
 * @param direction {BadgeTextDirection} Text direction for Badge (LEFT|RIGHT)
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes (ONLY FOR WEB)
 */
const Badge = async ({ children, className, classList, textContent, content, direction, ...others }: BadgeProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(!textContent ? styles.badge : styles.badgeAndText, className, validate(classList))

  if (textContent) {
    return (
      <div className={classes} {...others}>
        {direction && direction === BadgeTextDirection.LEFT && <Text markup={TextMarkup.P}>{textContent}</Text>}
        {!direction && <Text markup={TextMarkup.P}>{textContent}</Text>}
        <span className={classNames(styles.badge, styles.isLevel)}>{content || children}</span>
        {direction && direction === BadgeTextDirection.RIGHT && <Text markup={TextMarkup.P}>{textContent}</Text>}
      </div>
    )
  }

  return (
    <div className={classes} {...others}>
      {content ? (
        <Text className={classes} markup={TextMarkup.SPAN} {...others}>
          {content}
        </Text>
      ) : (
        children
      )}
    </div>
  )
}

export default Badge
