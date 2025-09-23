export interface DropdownTriggerClickEvent {
  active: boolean
}

type DropdownTriggerClickEventHandler = (event: DropdownTriggerClickEvent) => void

import { type GenericChildren } from '../../../generics/index.js'

/**
 * Dropdown Trigger Interface
 */
export interface DropdownTriggerProps {
  children?: GenericChildren | string
  onClick?: DropdownTriggerClickEventHandler
  active?: boolean
  label?: string
  name?: string
}

/**
 * Dropdown Trigger Web Interface
 */
export interface DropdownTriggerWebProps extends DropdownTriggerProps {
  className?: string
  classList?: string[]
}
