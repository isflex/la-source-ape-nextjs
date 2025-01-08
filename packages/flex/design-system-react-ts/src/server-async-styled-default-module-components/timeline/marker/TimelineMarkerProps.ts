import { IconName } from '../../icon/IconNameEnum.js'
import { GenericChildren } from '../../../generics/index.js'

/**
 * Timeline Marker Interface
 */
export interface TimelineMarkerProps {
  children?: GenericChildren | string
  iconName: IconName
}

/**
 * Timeline Marker Web Interface
 */
export interface TimelineMarkerWebProps extends TimelineMarkerProps {
  className?: string
  classList?: string[]
  iconClassname?: string
}
