import { HiddenMobile, HiddenTablet, HiddenDesktop, Alternate } from '../../../objects/facets/index.js'
import { NavbarItemMarkup } from './NavbarItemEnum.js'
import { type GenericChildren } from '../../../generics/index.js'

/**
 * Navbar Item Interface
 */
export interface NavbarItemProps extends HiddenMobile, HiddenTablet, HiddenDesktop, Alternate {
  // children?: React.JSX.Element | React.JSX.Element[] | string | number
  children?: GenericChildren | string | number
  megaDropdown?: boolean
  hoverable?: boolean
  active?: boolean
}

/**
 * Navbar Item Web Interface
 */
export interface NavbarItemWebProps extends NavbarItemProps {
  className?: string
  classList?: string[]
  id?: string
  markup?: NavbarItemMarkup
}
