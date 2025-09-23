import { CardImageSize } from './CardImageEnum.js'

// import { type GenericChildren } from '../../../generics/index.js'

/**
 * Card Image Interface
 */
export interface CardImageProps {
  src: string
  size?: CardImageSize
  className?: string
  classList?: string[]
  alt?: string
}
