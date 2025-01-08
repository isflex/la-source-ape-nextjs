// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
// import { camelCase } from 'lodash'
import { validate } from '../../../services/index.js'
import { InfoBlockHeaderProps } from './InfoBlockHeaderProps.js'
import { InfoBlockStatus } from '../InfoBlockEnum.js'
import { Icon, IconName } from '../../icon/index.js'
import { Title, TitleLevel } from '../../title/index.js'
// import { is } from '../../../services/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Info Block Header
 * @param children {string} Header title content
 * @param status {InfoBlockStatus} Icon status for header => SUCCESS|WARNING|DANGER
 * @param customIcon {IconName} Custom Icon for Info Block Header
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlockHeader = async ({
  className,
  classList,
  status,
  children,
  customIcon,
  ...others
}: InfoBlockHeaderProps): Promise<React.JSX.Element> => {
  const classes = classNames('info-block-header', styles.hasTextCentered, className, validate(classList))

  return (
    <header className={classes} {...others}>
      {status && (
        <Icon
          name={(customIcon && customIcon) || (status === InfoBlockStatus.WARNING && IconName.EXCLAMATION_CIRCLE) || IconName.CHECK_CIRCLE}
          className={classNames(
            styles.isLarge,
            // styles.camelCase(is(`${status}`)),
            {
              [styles.isInfo]: status === InfoBlockStatus.INFO,
              [styles.isWarning]: status === InfoBlockStatus.WARNING,
              [styles.isSuccess]: status === InfoBlockStatus.SUCCESS,
            },
          )}
        />
      )}
      <span>{children && typeof children.valueOf() === 'string' ? <Title level={TitleLevel.LEVEL3}>{children}</Title> : children}</span>
    </header>
  )
}

export default InfoBlockHeader
