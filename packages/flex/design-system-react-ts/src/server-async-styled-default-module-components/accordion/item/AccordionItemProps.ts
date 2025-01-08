export type TargetElement = HTMLElement & {
  active?: boolean
  id?: string
}

import { GenericChildren } from '../../../generics/index.js'

/**
 * OnClickEvent type
 */
export type OnClickEvent = React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | { target: TargetElement }

export interface OnClickCallback {
  (e: OnClickEvent): void
}

/**
 * AccordionItem Interface
 */
export interface AccordionItemProps {
  // children?: React.ReactNode | Array<React.ReactNode>
  children?: GenericChildren | string
  active?: boolean
  onClick?: OnClickCallback
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  className?: string
  classList?: string[]
  id?: string
  disabled?: boolean
  headerItems?: GenericChildren
  bodyItems?: GenericChildren
  v2?: boolean
}
