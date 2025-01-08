import { IconColor, IconName, IconSize } from '../../icon/index.js'
import { GenericChildren } from '../../../generics/index.js'

export interface SliceIconProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  iconName: IconName
  iconSize?: IconSize
  iconColor?: IconColor
}
