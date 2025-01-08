import React from 'react'
import classNames from 'classnames'
import { ToolbarWebProps } from './ToolbarProps.js'
import { has } from '../../services/index.js'

/**
 * Toolbar Component
 * @param className {string} Additionnal CSS Classes
 * @param background {BackgroundStyle} Custom background color
 */
const Toolbar = ({ className, background, ...others }: ToolbarWebProps): React.JSX.Element => {
  const classes = classNames('toolbar', background && has(background.getClassName()), className)

  return <div className={classes} {...others} />
}

export default Toolbar
