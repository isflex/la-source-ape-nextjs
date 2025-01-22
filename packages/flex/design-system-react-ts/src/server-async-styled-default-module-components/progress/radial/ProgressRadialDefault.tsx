'use server'

import React from 'react'
import classNames from 'classnames'
import { has, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { ProgressRadialProps } from './ProgressRadialProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Progress Radial component
 * @param percent {number} Progress percent
 * @param label {string} Custom label
 * @param description {string} Custom description
 * -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * -------------------------- NATIVE PROPERTIES -------------------------------
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER|TERTIARY)
 * @param full {boolean} Full progressRadial
 * @param disk {boolean} Disk ProgressRadial
 */
const ProgressRadial = async ({ className, classList, percent, label, description, ...others }: ProgressRadialProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    styles.radialProgressBar,
    percent && styles[camelCase(`progress-${percent}`) as keyof Styles],
    className,
    validate(classList),
  )

  return (
    <div className={classes} {...others}>
      {percent && (!label || !description) && <span className={styles.label}>{percent}%</span>}
      {(label || description) && (
        <>
          {label && <span className={classNames(styles.label, styles[camelCase(has('description')) as keyof Styles])}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </>
      )}
      <div className={styles.pie} />
    </div>
  )
}

export default ProgressRadial
