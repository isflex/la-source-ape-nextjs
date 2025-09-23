import { InfoBlockStatus } from '../InfoBlockEnum.js'
import { IconName } from '../../icon/index.js'
import { type GenericChildren } from '../../../generics/index.js'

export interface InfoBlockHeaderProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  status?: InfoBlockStatus
  customIcon?: IconName
}
