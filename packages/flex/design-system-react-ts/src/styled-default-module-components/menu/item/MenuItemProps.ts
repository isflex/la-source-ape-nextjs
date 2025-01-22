import { ClickEvent } from '../../../events/index.js'
import { IconName } from './../../icon/IconNameEnum.js'
// import { IconName } from '$IconNameEnumCamelCase.js'
import { GenericChildren } from '../../../generics/index.js'

/**
 * Menu Item Interface
 */
export interface MenuItemProps {
  children?: GenericChildren | string
  disabled?: boolean
  active?: boolean
  onClick?: ClickEvent
}

/**
 * Menu Item Web Interface
 */
export interface MenuItemWebProps extends MenuItemProps {
  to?: string
  className?: string
  classList?: string[]
  arrow?: boolean
  badge?: string | number
  icon?: IconName
}
