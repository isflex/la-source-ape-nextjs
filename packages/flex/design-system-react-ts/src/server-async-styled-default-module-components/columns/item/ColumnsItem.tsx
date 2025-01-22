'use server'

import React from 'react'
import classNames from 'classnames'
import { ColumnsItemProps } from './ColumnsItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Columns Item Component - Columns Child
 * @param size {ColumnsSize} Size 1-12
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param narrow {boolean} Narrow column item
 * @param className {string} Additionnal CSS Classes
 * @param mobileSize {ColumnsSize} Apply => is-size-mobile
 * @param tabletSize {ColumnsSize} Apply => is-size-tablet
 * @param desktopSize {ColumnsSize} Apply => is-size-desktop
 */
const ColumnsItem = async ({
  className,
  size,
  mobileSize,
  tabletSize,
  desktopSize,
  narrow,
  ...others
}: ColumnsItemProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    'column',
    size && is(`${size}`),
    mobileSize && is(`${mobileSize}-mobile`),
    tabletSize && is(`${tabletSize}-tablet`),
    desktopSize && is(`${desktopSize}-desktop`),
    narrow && is('narrow'),
    className,
  )

  return <div className={classes} {...others} />
}
export default ColumnsItem
