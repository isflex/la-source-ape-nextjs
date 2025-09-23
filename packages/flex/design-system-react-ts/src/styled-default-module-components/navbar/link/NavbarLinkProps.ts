import { ClickEvent } from '../../../events/index.js'
import { type GenericChildren } from '../../../generics/index.js'

/**
 * Navbar link Interface
 */
export interface NavbarLinkProps {
  children?: GenericChildren | string
  content?: string
  to?: string
  href?: string
  highlighted?: boolean
  onClick?: ClickEvent
}

/**
 * Navbar link Web Interface
 */
export interface NavbarLinkWebProps extends NavbarLinkProps {
  className?: string
  classList?: string[]
}
