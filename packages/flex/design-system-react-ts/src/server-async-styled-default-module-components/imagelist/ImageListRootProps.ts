// import { ImageListProps } from './ImageListProps.js'
// import { GenericChildren } from '../../generics/index.js'
import { ImageListRootMarkup } from './ImageListTagEnum.js'
import { ImageListProps } from './ImageListProps.js'

export interface ImageListRootProps {
  className?: string
  markup?: ImageListRootMarkup
  ref: React.ForwardedRef<unknown>
  ownerState: ImageListProps
  style?: React.CSSProperties
  children: React.ReactNode
}
