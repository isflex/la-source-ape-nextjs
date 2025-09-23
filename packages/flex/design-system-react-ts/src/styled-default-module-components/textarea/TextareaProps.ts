import { InputTextContentType, InputKeyboardType, InputKeyboardAppearance, InputAutoCompleteType, InputAutoCapitalize } from '../input/InputEnum.js'

export interface TextareaChangeEvent {
  textareaName: string
  textareaValue: string
}

type TextareaChangeEventHandler = (event: TextareaChangeEvent) => void

// import { type GenericChildren } from '../../generics/index.js'

/**
 * Textarea Interface
 */
export interface TextareaProps {
  placeholder?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: TextareaChangeEventHandler
  help?: string
  name?: string
  className?: string
  classList?: string[]
  hovered?: boolean
  focused?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  ref?: any | null
  keyboardStyle?: InputKeyboardAppearance
  autoCapitalize?: InputAutoCapitalize
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoCorrect?: any
  autoCompleteType?: InputAutoCompleteType
  textContentType?: InputTextContentType
  keyboardType?: InputKeyboardType
  id?: string
}
