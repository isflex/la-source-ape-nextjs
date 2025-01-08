// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { ProgressProps } from './ProgressProps.js'
import { is, has } from '../../services/index'
import { Text, TextLevel } from '../text/index.js'
import { Columns, ColumnsItem } from '../columns/index.js'

/**
 * Progress component
 * @param children {ReactNode} Use Children it only if stacked progress
 * @param percent {number} Progress percent
 * @param maxPercent {number} Default max percent is 100
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER)
 * @param small {boolean} Small progress
 * @param stacked {boolean} Stacked progress
 * @param uniqueLegend {string} Unique legend
 * @param firstExtremLegend {string} First extremity legend, only with secondExtremLegend property
 * @param secondExtremLegend {string} Second extremity legend, only with firstExtremLegend property
 * -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS classes
 */
const Progress = async ({
  children,
  className,
  percent,
  maxPercent = 100,
  alert,
  small,
  stacked,
  uniqueLegend,
  firstExtremLegend,
  secondExtremLegend,
  ...others
}: ProgressProps): Promise<React.JSX.Element> => {
  const classes = classNames('progress', alert && is(alert.getClassName()), !alert && is('primary'), small && is('small'), className)

  const stackedClasses = classNames('progress', stacked && is('stacked'), className)

  if (children && stacked) {
    return (
      <div className={stackedClasses} {...others}>
        {children}
      </div>
    )
  }

  return (
    <>
      <progress className={classes} value={percent} max={maxPercent} {...others}>
        {percent}
      </progress>
      {uniqueLegend && (
        <Text className={has('text-centered')} level={TextLevel.LEVEL2}>
          {uniqueLegend}
        </Text>
      )}
      {firstExtremLegend && secondExtremLegend && (
        <Columns mobile marginSize={3}>
          <ColumnsItem>
            <Text level={TextLevel.LEVEL2}>{firstExtremLegend}</Text>
          </ColumnsItem>
          <ColumnsItem narrow>
            <Text level={TextLevel.LEVEL2}>{secondExtremLegend}</Text>
          </ColumnsItem>
        </Columns>
      )}
    </>
  )
}

export default Progress
