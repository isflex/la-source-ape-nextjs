import { IconSize, IconStatus, IconPosition, TextIconMarkup, IconStatusPosition, IconColor } from './IconEnum.js'
import { IconName } from './IconNameEnum.js'
// import { IconName } from '$IconNameEnumCamelCase.js'
import { Stacked } from '../../objects/facets/index.js'
import { ClickEvent } from '../../events/index.js'

import { Styles } from '../../generics/index.js'

/**
 * Icon Interface
 */
export interface IconProps extends Stacked {
  name: IconName
  status?: IconStatus
  badgeContent?: string
  size?: IconSize
  circled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any
  position?: IconPosition
  markup?: TextIconMarkup
  statusPosition?: IconStatusPosition
  stretched?: boolean
  color?: IconColor
  onClick?: ClickEvent
  className?: string
  classList?: string[]
  textClassName?: string
  style?: Styles
}
