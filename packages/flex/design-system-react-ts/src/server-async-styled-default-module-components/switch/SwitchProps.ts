import { AlertProps, Invertable } from '../../objects/facets/index.js'
import { GenericChildren } from '../../generics/index.js'

export interface SwitchChangeEvent {
  switchState: boolean
  switchName: string
}

type SwitchChangeEventHandler = (event: SwitchChangeEvent) => void

export interface SwitchProps extends AlertProps, Invertable {
  checked?: boolean
  onChange?: SwitchChangeEventHandler
  label?: string | GenericChildren
  disabled?: boolean
  readonly?: boolean
  className?: string
  classList?: string[]
  id?: string
  value?: string
  name?: string
}
