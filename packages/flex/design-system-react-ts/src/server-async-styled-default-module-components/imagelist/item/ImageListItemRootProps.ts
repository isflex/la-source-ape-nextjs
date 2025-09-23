// import { ImageListProps } from './ImageListProps.js'
// import { type GenericChildren } from '../../../generics/index.js'
import { ImageListItemRootMarkup } from '../ImageListTagEnum.js'
import { ImageListItemProps } from './ImageListItemProps.js'

export interface ImageListItemRootProps {
  className?: string
  markup: ImageListItemRootMarkup
  ref: React.ForwardedRef<unknown>
  ownerState: ImageListItemProps
  style: React.CSSProperties
  children: React.ReactNode
}
