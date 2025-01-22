'use server'

import React from 'react'
import classNames from 'classnames'
import { IconProps } from '../IconProps.js'
import { IconStatus } from '../IconEnum.js'
import { getStatusBackground, is } from '../../../services/index'

const CircleIcon = async ({ className, name, status, size, ...others }: IconProps): Promise<React.AwaitedReactNode> => {
  // }: IconProps): React.JSX.Element | React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const background = getStatusBackground(status || '', IconStatus.TERTIARY)
  const classes = classNames(
    {
      icon: true,
      'has-text-white': true,
      [is(`${size}`)]: size,
    },
    [is('circled')],
    background,
    className,
  )
  return (
    <span className={classes} {...others}>
      <i className={name} />
    </span>
  )
}

export default CircleIcon
