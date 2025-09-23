import { ImageListVariant } from './ImageListVariantEnum.js'
// import { type GenericChildren } from '../../generics/index.js'

export interface ImageListProps {
  children: React.ReactNode
  // classes: object,
  classes?: Record<string, string>
  /**
   * @ignore
   */
  className?: string
  /**
   * Number of columns.
   * @default 2
   */
  cols: number
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component?: React.ReactElement | string
  gap?: number
  /**
   * The height of one row in px.
   * @default 'auto'
   */
  rowHeight?: 'auto' | number
  style?: React.CSSProperties
  variant: ImageListVariant
}
