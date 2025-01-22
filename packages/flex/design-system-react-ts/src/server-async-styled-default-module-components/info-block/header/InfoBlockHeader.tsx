'use server'

import React from 'react'
import classNames from 'classnames'
import { InfoBlockHeaderProps } from './InfoBlockHeaderProps.js'
import { InfoBlockStatus } from '../InfoBlockEnum.js'
import { has } from '../../../services/index.js'
import { Icon, IconName } from '../../icon/index.js'
import { Title, TitleLevel } from '../../title/index.js'
// import { is } from '../../../services/index.js'

/**
 * Info Block Header
 * @param children {string} Header title content
 * @param status {InfoBlockStatus} Icon status for header => SUCCESS|WARNING|DANGER
 * @param customIcon {IconName} Custom Icon for Info Block Header
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlockHeader = async ({ className, status, children, customIcon, ...others }: InfoBlockHeaderProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('info-block-header', has('text-centered'), className)

  return (
    <header className={classes} {...others}>
      {status && (
        <Icon
          name={(customIcon && customIcon) || (status === InfoBlockStatus.WARNING && IconName.EXCLAMATION_CIRCLE) || IconName.CHECK_CIRCLE}
          className={classNames(
            'is-large',
            // is(`${status}`),
            {
              'is-warning': status === InfoBlockStatus.WARNING,
              'is-success': status === InfoBlockStatus.SUCCESS,
            },
          )}
        />
      )}
      <span>{children && typeof children.valueOf() === 'string' ? <Title level={TitleLevel.LEVEL3}>{children}</Title> : children}</span>
    </header>
  )
}

export default InfoBlockHeader
