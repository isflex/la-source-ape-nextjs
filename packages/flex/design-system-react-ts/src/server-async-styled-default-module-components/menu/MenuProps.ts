import { type GenericChildren } from '../../generics/index.js'

/**
 * Menu Interface
 */
export interface MenuProps {
  // children?: React.JSX.Element | React.JSX.Element[] | string | number
  children?: GenericChildren | string | number
}

/**
 * Menu Web Interface
 */
export interface MenuWebProps extends MenuProps {
  className?: string
  classList?: string[]
  notASide?: boolean
}
