'use server'

import React from 'react'
import { IconName } from '../icon/index.js'
import {
  InputAutoCapitalize,
  InputAutoCompleteType,
  InputKeyboardAppearance,
  InputKeyboardType,
  InputStatus,
  InputTextContentType,
  // InputType,
} from './InputEnum.js'

export interface InputChangeEvent {
  inputName: string
  inputValue: string
}

type InputChangeEventHandler = (event: InputChangeEvent) => void

export interface InputKeyboardEvent {
  inputName: string
  inputValue: string
  inputKeyCode: number
}

type InputKeyboardEventHandler = (event: InputKeyboardEvent) => void

export interface InputClickEvent {
  inputName: string
  inputValue: string
}

type InputClickEventHandler = (event: InputClickEvent) => void

export interface InputNativeEvents {
  onClick?: InputClickEventHandler
  onChange?: InputChangeEventHandler
}

export interface InputWebEvents {
  onChange?: InputChangeEventHandler
  onKeyUp?: InputKeyboardEventHandler
  onKeyPress?: InputKeyboardEventHandler
  onIconClick?: InputClickEventHandler
  onClick?: InputClickEventHandler
}

// import { type GenericChildren } from '../../generics/index.js'

/**
 * Input Interface
 */
export interface InputProps {
  id?: string
  // type?: InputType
  type?: React.HTMLInputTypeAttribute
  content?: string
  placeholder?: string
  // defaultValue?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any
  // value?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  disabled?: boolean
  loading?: boolean
  hasIcon?: boolean
  customIcon?: IconName
  iconClassname?: string
  status?: InputStatus
  help?: string
  name?: string
  search?: boolean
  className?: string
  classList?: string[]
  hovered?: boolean
  focused?: boolean
  ref?: React.LegacyRef<HTMLInputElement>
  // ref?: React.LegacyRef<HTMLInputElement> | React.MutableRefObject<HTMLInputElement> | React.ForwardedRef<unknown>
  keyboardStyle?: InputKeyboardAppearance

  autoCapitalize?: InputAutoCapitalize
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // autoCapitalize?: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoCorrect?: any

  autoComplete?: InputAutoCompleteType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // autoComplete?: any

  textContentType?: InputTextContentType
  keyboardType?: InputKeyboardType
  forceControl?: boolean
}
