import { GenericChildren } from '../../../generics/index.js'

export interface SliceImageProps {
  children?: GenericChildren | string
  className?: string
  classList?: string[]
  src?: string
  alt?: string
  rounded?: boolean
}
