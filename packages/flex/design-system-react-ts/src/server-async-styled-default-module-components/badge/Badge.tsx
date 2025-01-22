'use server'

import React from 'react'
import classNames from 'classnames'
import { BadgeProps } from './BadgeProps.js'
import { Text, TextMarkup } from '../text/index.js'
import { BadgeTextDirection } from './BadgeEnum.js'

/**
 * Badge Component
 * @param children {ReactNode} If no content add children (Icon for example)
 * @param textContent {string} Content text for badge with text, if textContent props, it will display badge with text
 * @param content content {string|number} Badge content text
 * @param direction {BadgeTextDirection} Text direction for Badge (LEFT|RIGHT)
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes (ONLY FOR WEB)
 */
const Badge = async ({ children, className, textContent, content, direction, ...others }: BadgeProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(!textContent ? 'badge' : 'badge-and-text', className)

  if (textContent) {
    return (
      <div className={classes} {...others}>
        {direction && direction === BadgeTextDirection.LEFT && <Text markup={TextMarkup.P}>{textContent}</Text>}
        {!direction && <Text markup={TextMarkup.P}>{textContent}</Text>}
        <span className='badge is-level'>{content || children}</span>
        {direction && direction === BadgeTextDirection.RIGHT && <Text markup={TextMarkup.P}>{textContent}</Text>}
      </div>
    )
  }

  return (
    <div>
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
