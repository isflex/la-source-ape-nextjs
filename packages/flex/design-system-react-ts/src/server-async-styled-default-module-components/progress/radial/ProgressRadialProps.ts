import { AlertProps } from '../../../objects/facets/index.js'

import { type GenericChildren } from '../../../generics/index.js'

/**
 * Progress Radial Interface
 */
export interface ProgressRadialProps extends AlertProps {
  children?: GenericChildren | string
  percent: number
  label?: string | React.ReactNode
  description?: string | React.ReactNode
  className?: string
  classList?: string[]
  full?: boolean
  disk?: boolean
}
