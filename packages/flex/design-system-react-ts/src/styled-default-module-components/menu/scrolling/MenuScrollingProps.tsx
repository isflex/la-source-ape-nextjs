import { MenuProps } from '../MenuProps.js'

/**
 * MenuScrolling  Interface
 */
export interface MenuScrollingProps extends MenuProps {
  className?: string
  classList?: string[]
  pulled?: 'left' | 'right'
  hasBackgroundWhite?: boolean
}
