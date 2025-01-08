import { ButtonMarkup } from '../../button/ButtonEnum.js'
import { TitleLevel } from '../../title/TitleEnum.js'
import { TextLevel } from '../../text/TextEnum.js'
import { ClickEvent } from '../../../events/index.js'
import { VariantState } from '../../../objects/facets/index.js'
import { GenericChildren } from '../../../generics/index.js'

/**
 * Card Content Interface
 */
export interface CardContentProps {
  children?: GenericChildren | string
  titleSup?: string
  titleSupLevel?: TextLevel
  title?: GenericChildren | string
  titleLevel?: TitleLevel
  buttonText?: GenericChildren | string
  text?: GenericChildren | string
  textLevel?: TextLevel
  buttonVariant?: VariantState
  buttonClick?: ClickEvent
  className?: string
  classList?: string[]
  buttonMarkup?: ButtonMarkup
}
