import { Invertable } from '../../objects/facets/index.js'

export interface RadioChangeEvent {
  radioId: string
  radioValue: string
  radioName: string
  radioChecked: boolean
}

type RadioChangeEventHandler = (event: RadioChangeEvent) => void

export interface RadioClickEvent {
  radioId: string
  radioValue: string
  radioName: string
  radioChecked: boolean
}

type RadioClickEventHandler = (event: RadioClickEvent) => void

import { type GenericChildren } from '../../generics/index.js'

/**
 * Radio Interface
 */
export interface RadioProps extends Invertable {
  children?: GenericChildren | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checked?: any
  disabled?: boolean
  readonly?: boolean
  id?: string
  label?: string
  labelClassName?: string
  onClick?: RadioClickEventHandler
  onChange?: RadioChangeEventHandler
  className?: string
  classList?: string[]
  name?: string
  value?: string
}
