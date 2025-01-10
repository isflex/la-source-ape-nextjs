// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { ContainerProps } from './ContainerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Container Component
 * @param fluid {boolean} Make the container usable across the width of your section
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const Container = async ({ className, classList, fluid, ...others }: ContainerProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.container, fluid && styles.isFluid, className, validate(classList))

  return <div className={classes} {...others} />
}

export default Container
