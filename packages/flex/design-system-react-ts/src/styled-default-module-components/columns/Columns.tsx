import React from 'react'
import classNames from 'classnames'
import { ColumnsProps } from './ColumnsProps.js'
import { is } from '../../services/index.js'

/**
 * Columns Component
 * @param centered {boolean} Center columns
 * @param verticalCentered {boolean} Vertical centered columns
 * @param gapless {boolean} Delete margins between columns
 * @param marginSize {ColumnsSize} Delete margins between columns with Size (apply is-variable)
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param multiline {boolean} Multiline Columns
 * @param className {string} Additionnal CSS Classes
 * @param mobile {boolean} Responsive mode
 * @param flex {boolean} Flex direction
 */
const Columns = ({
  className,
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
    'columns',
    multiline && is('multiline'),
    mobile && is('mobile'),
    centered && is('centered'),
    verticalCentered && is('vcentered'),
    !marginSize && gapless && is('gapless'),
    !gapless && marginSize && [is('variable'), is(`${marginSize}`)],
    flex && is('flex'),
    className,
  )

  return <div className={classes} {...others} />
}

export default Columns
