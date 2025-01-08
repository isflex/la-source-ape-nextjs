import { GenericChildren } from '../../../generics/index.js'

/**
 * ListItem Interface
 */
import { IconName } from '../../icon/index.js'

export enum ListIconStatus {
  SUCCESS = 'success',
  DANGER = 'danger',
}

export interface ListItemProps {
  children?: GenericChildren
  className?: string
  classList?: string[]
  customIcon?: IconName
  status?: ListIconStatus
  title?: string
  description?: string
}
