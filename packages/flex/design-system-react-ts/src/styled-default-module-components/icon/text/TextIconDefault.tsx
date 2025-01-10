'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import Icon from '../IconDefault.js'
import { IconProps } from '../IconProps.js'
import { IconPosition, TextIconMarkup } from '../IconEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

const TextIcon = ({ className, classList, textClassName, name, content, position, markup, ...others }: IconProps): React.JSX.Element => {
  // }: IconProps): React.JSX.Element & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const Tag = markup && (markup in TextIconMarkup || Object.values(TextIconMarkup).includes(markup)) ? markup : 'span'

  if (position) {
    return (
      <span
        className={classNames(styles.iconAndText, (position === IconPosition.UP || position === IconPosition.DOWN) && styles.isStacked, className)}
      >
        {
          (position === IconPosition.RIGHT || position === IconPosition.DOWN) &&
            content &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (content && typeof content.valueOf() === 'string' ? <Tag className={textClassName}>{String(content)}</Tag> : content)
          // <Tag className={textClassName}>{content}</Tag>
        }
        <Icon name={name} className={className} {...others} />
        {
          (position === IconPosition.UP || position === IconPosition.LEFT) &&
            content &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (content && typeof content.valueOf() === 'string' ? <Tag className={textClassName}>{String(content)}</Tag> : content)
          // <Tag className={textClassName}>{content}</Tag>
        }
      </span>
    )
  }

  return (
    <span className={classNames(styles.iconAndText, className, validate(classList))}>
      <Icon name={name} {...others} />
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
      {content && typeof content.valueOf() === 'string' ? <Tag className={textClassName}>{String(content)}</Tag> : content}
      {/* {content && <Tag className={textClassName}>{content}</Tag>} */}
    </span>
  )
}

export default TextIcon
