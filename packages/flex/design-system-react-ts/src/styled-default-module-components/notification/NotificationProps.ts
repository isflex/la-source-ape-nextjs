import { AlertProps } from '../../objects/facets/index.js'
import { IconName } from '../icon/IconNameEnum.js'
import { ClickEvent } from '../../events/index.js'
import { ButtonMarkup } from '../button/index.js'

import { GenericChildren } from '../../generics/index.js'

/**
 * Notification Interface
 */
export interface NotificationProps extends AlertProps {
  children?: GenericChildren | string
  iconName?: IconName
  title?: string
  description?: string
  buttonContent?: string
  buttonClick?: ClickEvent
  arrow?: boolean
  info?: boolean
  banner?: boolean
  className?: string
  classList?: string[]
  iconClassname?: string
  buttonMarkup?: ButtonMarkup
}
