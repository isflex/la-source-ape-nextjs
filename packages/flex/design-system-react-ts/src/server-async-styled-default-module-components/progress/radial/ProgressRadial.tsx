'use server'

import React from 'react'
import classNames from 'classnames'
import { ProgressRadialProps } from './ProgressRadialProps.js'
import { has } from '../../../services/index.js'

/**
 * Progress Radial component
 * @param percent {number} Progress percent
 * @param label {string} Custom label
 * @param description {string} Custom description
 * -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS classes
 * -------------------------- NATIVE PROPERTIES -------------------------------
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER|TERTIARY)
 * @param full {boolean} Full progressRadial
 * @param disk {boolean} Disk ProgressRadial
 */
const ProgressRadial = async ({ className, percent, label, description, ...others }: ProgressRadialProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames('radial-progress-bar', percent && `progress-${percent}`, className)

  return (
    <div className={classes} {...others}>
      {percent && (!label || !description) && <span className='label'>{percent}%</span>}
      {(label || description) && (
        <>
          {label && <span className={`label ${has('description')}`}>{label}</span>}
          {description && <span className='description'>{description}</span>}
        </>
      )}
      <div className='pie' />
    </div>
  )
}

export default ProgressRadial
