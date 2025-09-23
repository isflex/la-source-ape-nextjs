import { type GenericChildren } from '../../generics/index.js'

/**
 * Arrow direction
 */
export enum ArrowDirection {
  UP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * Arrow align
 */
export enum ArrowAlign {
  ONE_FIFTH = 'one-fifth',
  ONE_QUARTER = 'one-quarter',
  ONE_THRID = 'one-thrid',
  TWO_FIFTHS = 'two-fifths',
  THREE_FIFTHS = 'three-fifths',
  TWO_THIRDS = 'two-thirds',
  THREE_QUARTERS = 'three-quarters',
  FOUR_FIFTHS = 'four-fifths',
}

/**
 * Avatar direction
 */
export enum AvatarDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * Product Tour Interface
 */
export interface ProductTourProps {
  children?: GenericChildren | string
  active?: boolean
  arrowDirection?: ArrowDirection
  arrowAlign?: ArrowAlign
  closeable?: boolean
  avatarSrc?: string
  avatarDirection?: AvatarDirection
}

/**
 * Product Tour Web Interface
 */
export interface ProductTourWebProps extends ProductTourProps {
  className?: string
  classList?: string[]
}
