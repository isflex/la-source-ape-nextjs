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
const Container = ({ className, fluid, ...others }: ContainerProps): React.JSX.Element => {
  const classes = classNames('container', fluid && is('fluid'), className)

  return <div className={classes} {...others} />
}

export default Container
