export interface SelectChangeEvent {
  selectValue?: string
  selectName?: string
  selectId?: string
}

type SelectChangeEventHandler = (event: SelectChangeEvent) => void

import { type GenericChildren } from '../../generics/index.js'

/**
 * Select Interface
 */
export interface SelectProps {
  className?: string
  classList?: string[]
  id?: string
  name?: string
  value?: string
  label?: React.JSX.Element | string
  selected?: string
  nullable?: boolean
  onChange?: SelectChangeEventHandler
  children?: GenericChildren | string
  dynamicPlaceholder?: boolean
  placeholder?: string
  placeholderId?: string
  // ref?: React.LegacyRef<HTMLSelectElement>
  ref?: React.ForwardedRef<HTMLSelectElement>
}
