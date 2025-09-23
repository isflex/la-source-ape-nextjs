'use server'

import React from 'react'
import { ImageListVariant } from '../ImageListVariantEnum.js'
// import { type GenericChildren } from '../../../generics/index.js'

export interface ImageListItemProps {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component, normally an `<img>`.
   */
  children: React.ReactNode
  /**
   * Override or extend the styles applied to the component.
   */
  // classes?: object,
  classes?: Record<string, string>
  /**
   * @ignore
   */
  className?: string
  /**
   * Width of the item in number of grid columns.
   * @default 1
   */
  cols: number
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component?: React.ReactElement | string
  /**
   * Height of the item in number of grid rows.
   * @default 1
   */
  rows: number
  /**
   * @ignore
   */
  style?: React.CSSProperties
  variant?: ImageListVariant
}
