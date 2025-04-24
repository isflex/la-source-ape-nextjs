'use server'

import React from 'react'
import classNames from 'classnames'
import { ContainerProps } from './ContainerProps.js'
import { is } from '../../services/index.js'

/**
 * Container Component
 * @param fluid {boolean} Make the container usable across the width of your section
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const Container = async ({ className, fluid, ...others }: ContainerProps): Promise<React.ReactNode> => {
  const classes = classNames('container', fluid && is('fluid'), className)

  return <div className={classes} {...others} />
}

export default Container
