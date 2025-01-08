// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { ColumnsItemProps } from './ColumnsItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Columns Item Component - Columns Child
 * @param size {ColumnsSize} Size 1-12
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param narrow {boolean} Narrow column item
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param mobileSize {ColumnsSize} Apply => is-size-mobile
 * @param tabletSize {ColumnsSize} Apply => is-size-tablet
 * @param desktopSize {ColumnsSize} Apply => is-size-desktop
 */
const ColumnsItem = async ({
  className,
  classList,
  size,
  mobileSize,
  tabletSize,
  desktopSize,
  narrow,
  ...others
}: ColumnsItemProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.column,
    size && styles[camelCase(is(`${size}`)) as keyof Styles],
    mobileSize && styles[camelCase(is(`${mobileSize}-mobile`)) as keyof Styles],
    tabletSize && styles[camelCase(is(`${tabletSize}-tablet`)) as keyof Styles],
    desktopSize && styles[camelCase(is(`${desktopSize}-desktop`)) as keyof Styles],
    narrow && styles.isNarrow,
    className,
    validate(classList),
  )

  return <div className={classes} {...others} />
}
export default ColumnsItem
