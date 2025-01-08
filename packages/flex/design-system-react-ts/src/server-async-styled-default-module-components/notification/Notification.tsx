// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { NotificationProps } from './NotificationProps.js'
import { is, has } from '../../services/index.js'
import { Icon, IconName, IconSize } from '../icon/index.js'
import { Title, TitleLevel } from '../title/index.js'
import { Text } from '../text/index.js'
import { Button } from '../button/index.js'
import { VariantState } from '../../objects/facets/index.js'

/**
 * Table Component
 * @param iconName {IconName} Custom icon
 * @param title {string} Notification title content
 * @param description {string} Notification description content
 * @param alert {AlertState} Alert Variant (INFO|SUCCESS|WARNING|DANGER)
 * @param buttonClick {ClickEvent} Click event for button
 * @param buttonContent {string} Button content
 * @param arrow {boolean} Notification with right arrow on right side (Uses only if not button content)
 * @param info (boolean) Small info notification use it without button and arrow
 * @param banner {boolean} Banner notification
 *  * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param iconClassname {string} Additionnal Icon CSS
 * @param buttonMarkup {ButtonMarkup} Custom markup for button
 */
const Notification = async ({
  className,
  iconClassname,
  iconName,
  title,
  description,
  alert,
  buttonContent,
  buttonClick,
  buttonMarkup,
  arrow,
  info,
  banner,
  ...others
}: NotificationProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    'notification',
    has('body'),
    !buttonContent && !arrow && info && is('small'),
    banner && !buttonContent && !arrow && !info && [is('banner'), !description && has('description')],
    description && has('description'),
    alert && is(alert.getClassName()),
    className,
  )

  return (
    <div className={classes} {...others}>
      <Icon className={iconClassname} name={iconName || (info && IconName.UI_INFO_CIRCLE) || IconName.UI_BELL} />
      <div className='body'>
        {title && <Title level={TitleLevel.LEVEL5}>{title}</Title>}
        {description && <Text>{description}</Text>}
      </div>
      {buttonContent && !arrow && (
        <div className='call-to-action'>
          <Button variant={VariantState.PRIMARY} markup={buttonMarkup} onClick={buttonClick}>
            {buttonContent}
          </Button>
        </div>
      )}
      {arrow && !buttonContent && (
        <div onClick={buttonClick} className='call-to-action'>
          <Icon name={IconName.UI_ARROW_RIGHT} size={IconSize.SMALL} />
        </div>
      )}
    </div>
  )
}

export default Notification
