import { TextLevel, TextMarkup } from './TextEnum.js'
import { TypographyColor, TypographyTransform, TypographyBold, TypographyAlign } from '../../objects/typography/index.js'
import { ClickEvent } from '../../events/index.js'
import { Invertable } from '../../objects/facets/index.js'

import { GenericChildren, Styles } from '../../generics/index.js'

/**
 * Text Interface
 */
export interface TextProps extends Invertable {
  level?: TextLevel
  // children?: React.ReactNode | Array<React.ReactNode>
  children?: GenericChildren | string | Array<React.ReactNode>
  typo?: TypographyColor | TypographyTransform | TypographyBold | TypographyAlign
  onClick?: ClickEvent
  markup?: TextMarkup
  className?: string
  classList?: string[]
  href?: string
  title?: string
  style?: Styles
}
