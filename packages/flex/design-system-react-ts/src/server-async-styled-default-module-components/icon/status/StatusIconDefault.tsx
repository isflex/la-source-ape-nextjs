// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { IconProps } from '../IconProps.js'
import { IconName } from '../IconNameEnum.js'
import { IconStatus } from '../IconEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

const StatusIcon = async ({ className, classList, name, status, statusPosition, size, ...others }: IconProps): Promise<React.JSX.Element> => {
  // }: IconProps): React.JSX.Element & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const ancestorClasses = classNames(
    styles.icon,
    size && styles[camelCase(is(`${size}`)) as keyof Styles],
    styles.isAncestor,
    styles.hasStatus,
    className,
    validate(classList),
  )

  const descendantClasses = classNames(
    styles.icon,
    styles.isCircled,
    styles.isDescendant,
    status && styles[camelCase(is(`${status}`)) as keyof Styles],
    statusPosition && styles[camelCase(is(`${statusPosition}`)) as keyof Styles],
  )

  const iconName = styles[camelCase(name) as keyof Styles]
  const descendantIcon = status === IconStatus.SUCCESS ? IconName.UI_CHECK_CIRCLE_S : IconName.UI_TIMES_CIRCLE_S
  const descendantIconName = styles[camelCase(descendantIcon) as keyof Styles]

  return (
    <span className={ancestorClasses} aria-hidden='true' {...others}>
      <span className={iconName}>
        <span className={descendantClasses}>
          <span className={descendantIconName} />
        </span>
      </span>
    </span>
  )
}

export default StatusIcon
