'use server'

import React from 'react'
import classNames from 'classnames'
import { ProgressItemProps } from './ProgressItemProps.js'
import { is } from '../../../services/index'

/**
 * Progress Item component - Only if stacked
 * @param percent {number} Progress percent
 * @param minPercent {number} Default min percent is 100
 * @param maxPercent {number} Default max percent is 100
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER)
 * -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS classes
 */
const ProgressItem = async ({
  className,
  percent,
  maxPercent = 100,
  minPercent = 0,
  alert,
  ...others
}: ProgressItemProps): Promise<React.ReactNode> => {
  const classes = classNames('progress-bar', alert && is(alert.getClassName()), !alert && is('primary'), className)

  return (
    <div
      {...(percent && { style: { width: `${percent}%` } })}
      className={classes}
      role='progressbar'
      aria-valuenow={percent}
      aria-valuemin={minPercent}
      aria-valuemax={maxPercent}
      {...others}
    />
  )
}

export default ProgressItem
