import { TitleLevel, TitleMarkup } from './TitleEnum.js'
import { Invertable, TypographyColor, TypographyTransform, TypographyBold, TypographyAlign } from '../../objects/index.js'
import { GenericChildren, Styles } from '../../generics/index.js'

/**
 * Title Interface
 */
export interface TitleProps extends Invertable {
  children?: GenericChildren | string
  level?: TitleLevel
  loading?: boolean
  typo?: TypographyColor | TypographyTransform | TypographyBold | TypographyAlign | string
  skeleton?: boolean
  className?: string
  classList?: string[]
  href?: string
  inverted?: boolean
  markup?: TitleMarkup
  style?: Styles
}
