'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { ColumnsProps } from './ColumnsProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Columns Component
 * @param centered {boolean} Center columns
 * @param verticalCentered {boolean} Vertical centered columns
 * @param gapless {boolean} Delete margins between columns
 * @param marginSize {ColumnsSize} Delete margins between columns with Size (apply is-variable)
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param multiline {boolean} Multiline Columns
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param mobile {boolean} Responsive mode
 * @param flex {boolean} Flex direction
 */
const Columns = ({
  className,
  classList,
  multiline,
  mobile,
  centered,
  verticalCentered,
  gapless,
  marginSize,
  flex,
  ...others
}: ColumnsProps): React.JSX.Element => {
  const classes = classNames(
    styles.columns,
    multiline && styles.isMultiline,
    mobile && styles.isMobile,
    centered && styles.isCentered,
    verticalCentered && styles.isVcentered,
    !marginSize && gapless && styles.isGapless,
    !gapless && marginSize && [styles.isVariable, styles[camelCase(is(`${marginSize}`)) as keyof Styles]],
    flex && styles.isFlex,
    className,
    validate(classList),
  )

  return <div className={classes} {...others} />
}

export default Columns
