'use server'

import React from 'react'
import classNames from 'classnames'
import { IconProps } from '../IconProps.js'
import { IconName } from '../IconNameEnum.js'
// import { IconName } from '$IconNameEnumCamelCase.js'
import { IconStatus } from '../IconEnum.js'
import { is, has } from '../../../services/index'

const StatusIcon = async ({ className, name, status, statusPosition, size, ...others }: IconProps): Promise<React.AwaitedReactNode> => {
  // }: IconProps): React.JSX.Element | React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const ancestorClasses = classNames('icon', size && is(`${size}`), is('ancestor'), has('status'), className)
  const descendantClasses = classNames('icon is-circled is-descendant', status && is(`${status}`), statusPosition && is(`${statusPosition}`))
  const descendantIcon = status === IconStatus.SUCCESS ? IconName.UI_CHECK_CIRCLE_S : IconName.UI_TIMES_CIRCLE_S

  return (
    <span className={ancestorClasses} aria-hidden='true' {...others}>
      <span className={name}>
        <span className={descendantClasses}>
          <span className={descendantIcon} />
        </span>
      </span>
    </span>
  )
}

export default StatusIcon
